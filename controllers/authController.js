const register = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      username, 
      firstName, 
      lastName, 
      role,
      game,
      region,
      marketingConsent
    } = req.body;

    // Transform role to uppercase
    const userRole = role ? role.toUpperCase() : 'PLAYER';

    // 1. Validate input
    if (!email || !password || !username || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Please provide all required fields' 
      });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists with this email or username' 
      });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        firstName,
        lastName,
        role: userRole,
        game: game || null,
        region: region || null
      }
    });

    // 5. Generate JWT token
    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Send response (don't send password!)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        game: user.game,
        region: user.region
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};