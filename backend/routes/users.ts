import { Router } from 'express';
import { db } from '../db';
import { users } from '../db/schema'; // Se till att detta matchar din schema-fil
import { eq } from 'drizzle-orm'; // Behövs för WHERE-frågor
import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcrypt';
import { SignupSchema, LoginSchema } from '../validation';

const router = Router();
const SALT_ROUNDS = 10;

// Hämta alla användare
router.get('/', async (req, res) => {
  try {
    // Drizzle returnerar en array direkt, ingen .rows behövs
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Något gick fel i databasen' });
  }
});

// Signup - Skapa användare
router.post('/signup', async (req, res) => {
  try {
    const result = SignupSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ 
        error: result.error.errors[0].message,
        details: result.error.errors 
      });
    }

    const { username, email, password } = result.data;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // .insert().values() ersätter INSERT INTO
    // .returning() låter oss välja vad vi vill få tillbaka direkt
    const [newUser] = await db.insert(users).values({
      username: username,
      email: email,
      passwordHash: hashedPassword, // Mappat till ditt kolumnnamn i schema.ts
    }).returning({ 
      id: users.id, 
      username: users.username, 
      email: users.email 
    });

    res.status(201).json({
      message: 'Användare skapad!',
      user: newUser
    });

  } catch (err: any) {
    // Postgres felkod för "unique_violation" är fortfarande 23505
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Användarnamnet eller e-posten finns redan' });
    }
    console.error('Database error:', err);
    res.status(500).json({ error: 'Något gick fel vid skapandet av kontot' });
  }
});

// Login - Hitta användare
router.post('/login', async (req, res) => {
  try {
    const result = LoginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ 
        error: result.error.errors[0].message 
      });
    }

    const { username, password } = result.data;

    // .where(eq(kolumn, värde)) ersätter WHERE username = $1
    const [user] = await db.select().from(users).where(eq(users.username, username));

    if (!user) {
      return res.status(401).json({ error: 'Fel användarnamn eller lösenord' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash as string)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Fel användarnamn eller lösenord' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET as string, 
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Inloggningen lyckades',
      token,
      user: { id: user.id, username: user.username }
    });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internt serverfel' });
  }
});

// Hämta en specifik användare med deras skapade jobb
router.get('/:id', async (req, res) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.params.id),
      with: {
        jobs: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Användaren hittades inte' });
    }

    res.json(user);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Något gick fel i databasen' });
  }
});

// Ta bort en användare
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.delete(users).where(eq(users.id, req.params.id)).returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Användaren hittades inte' });
    }

    res.json({ message: 'Användare borttagen', user: result[0] });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Något gick fel i databasen' });
  }
});

router.post('/logout', async (req, res) => {
  res.status(200).json({ message: 'Utloggningen lyckades' });
});

export default router;