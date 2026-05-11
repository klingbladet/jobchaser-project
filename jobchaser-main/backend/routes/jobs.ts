import { Router } from 'express';
import { db } from '../db';
import { jobs, savedJobs } from '../db/schema'; 
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { eq, and } from 'drizzle-orm'
import crypto from 'crypto'
import { JobSchema, PartialJobSchema } from '../validation';

const router = Router();

// GET all jobs with optional filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { municipality, status, limit, offset } = req.query;

    const conditions = [eq(jobs.source, 'local')];

    if (municipality) {
      conditions.push(eq(jobs.municipality, municipality as string));
    }
    if (status) {
      conditions.push(eq(jobs.status, status as string));
    }

    const allJobs = await db.select()
    .from(jobs)
    .where(and(...conditions))
    .limit(Number(limit) || 100)
    .offset(Number(offset) || 0);

    res.json(allJobs);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Kunde inte hämta jobb' });
  }
});

// GET - get specific job by ID
router.get('/:id', async (req, res) => {
  try {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, req.params.id));
    if (!job) {
      return res.status(404).json({ error: "Jobbet hittades inte" });
    }
    res.json(job);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Något gick fel i databasen' });
  }
});

// POST - create new Job
router.post('/', authenticateToken, async (req, res) => {
  try {
    const result = JobSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ 
        error: result.error.errors[0].message,
        details: result.error.errors 
      });
    }

    const { headline, employerName, municipality, descriptionText, workingHoursLabel, durationLabel, webpageUrl } = result.data;
    const userId = (req as AuthRequest).user?.id;

    if(!userId) {
      return res.status(401).json({ error: "Du måste vara inloggad" });
    }

    const [newJob] = await db.insert(jobs).values({
      id: crypto.randomUUID(),
      headline,
      employerName,
      municipality,
      descriptionText,
      workingHoursLabel,
      durationLabel,
      webpageUrl,
      userId,
      source: 'local'
    }).returning();

    res.status(201).json({
      message: 'Jobb tillagt!',
      job: newJob
    })
  } catch (err: any) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Något gick fel vid skapandet av jobbet' });
  }
})

// PATCH - update a job (partial)
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const { id } = req.params;

    const result = PartialJobSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors[0].message });
    }

    // Uppdatera endast om jobbet tillhör användaren
    const updatedJob = await db.update(jobs)
      .set(result.data)
      .where(and(eq(jobs.id, id), eq(jobs.userId, userId as string)))
      .returning();

    if (updatedJob.length === 0) {
      return res.status(404).json({ error: "Jobbet hittades inte eller så saknar du behörighet" });
    }

    res.json({ message: "Jobbet uppdaterat", job: updatedJob[0] });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Något gick fel vid uppdateringen' });
  }
});

// Delete a job
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user?.id;

    const result = await db.delete(jobs)
      .where(
        and(
        eq(jobs.id, id as string),
        eq(jobs.userId, userId as string)
        )
      )
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Jobbet hittades inte" })
    }
    res.json({
      message: 'Jobbet har raderats',
      job: result[0]
    })
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Något gick fel i databasen' })
  }
});

router.get('/saved', authenticateToken, async (req, res) => {
  const userId = (req as AuthRequest).user?.id;
    if (!userId) {
    return res.status(401).json({ error: 'Du måste vara inloggad' });
  }
  try {
    const userSavedJobs = await db
    .select({
      id: jobs.id,
      headline: jobs.headline,
      employerName: jobs.employerName,
      municipality: jobs.municipality,
      descriptionText: jobs.descriptionText,
      workingHoursLabel: jobs.workingHoursLabel,
      durationLabel: jobs.durationLabel,
      webpageUrl: jobs.webpageUrl
    })
    .from(jobs)
    .innerJoin(savedJobs, eq(jobs.id, savedJobs.jobId))
    .where(eq(savedJobs.userId, userId));

    const formattedJobs = userSavedJobs.map(job => ({
      id: job.id,
      headline: job.headline,
      employer: { name: job.employerName },
      workplace_adress: { municipality: job.municipality },
      description: { text: job.descriptionText },
      webpage_url: job.webpageUrl,
      working_hours_type: { label: job.workingHoursLabel },
      duration: { label: job.durationLabel }
    }));

    res.json(formattedJobs);
  } catch (err) {
    console.error('Fel vid hämtning av sparade jobb')
    res.status(500).json({ error: 'Failed to fetch saved jobs'});
  }
});

router.post('/saved', authenticateToken, async (req, res) => {
  const { jobId, jobData } = req.body;
  const userId = (req as AuthRequest).user?.id;

  if(!jobId || !jobData) 
    return res.status(400).json({ error: 'jobId saknas' });
  if(!userId) 
    return res.status(401).json({ error: 'Ej inloggad' });

  try {
    await db.insert(jobs).values({
      id: jobId,
      headline: jobData.headline,
      employerName: jobData.employer?.name || "Okänd",
      municipality: jobData.workplace_adress?.municipality,
      descriptionText: jobData.description?.text,
      workingHoursLabel: jobData.working_hours_type?.label,
      durationLabel: jobData.duration?.label,
      webpageUrl: jobData.webpage_url,
      logoUrl: jobData.logo_url,
      publicationDate: jobData.publication_date ? new Date(jobData.publication_date).toISOString() : new Date().toISOString(),
      source: 'api'
    }).onConflictDoNothing({ target:jobs.id });


    await db.insert(savedJobs).values({ 
      userId, jobId 
    });
    res.status(201).json({ message: 'Jobbet har sparats!' })
  } catch (err: any) {
    if(err.code === '23505') {
      return res.status(400).json({ error: 'Du har redan sparat jobb' })
    }
    res.status(500).json({ error: 'Kunde inte spara jobbet' });
  }
});

router.delete('/saved/:id', authenticateToken, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const jobId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'Ej inloggad' })
    }

    const result = await db.delete(savedJobs)
      .where(
        and(
          eq(savedJobs.userId, userId),
          eq(savedJobs.jobId, jobId as string) 
        )
      )
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Kopplingen hittades inte" })
    }
    res.json({
      message: 'Jobbet har tagits bort från dina sparade jobb'
    })
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Något gick fel i databasen' })
  }
});

export default router;
