app.post('/customers', (req, res) => {
  const { name, email, credit_card_number } = req.body;

  // Validate email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Validate credit card number
  const creditCardRegex = /^\d{12}$/;
  if (!creditCardRegex.test(credit_card_number)) {
    return res.status(400).json({ error: 'Invalid credit card number' });
  }

  // Insert new customer into the database
  const query = 'INSERT INTO customer (name, email, credit_card_number) VALUES ($1, $2, $3) RETURNING id';
  const values = [name, email, credit_card_number];

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const customerId = result.rows[0].id;
    return res.status(201).json({ customerId });
  });
});
