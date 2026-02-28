const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const rules = yaml.load(fs.readFileSync(__dirname + '/rules.yaml', 'utf8'));

app.post('/api/eligibility', (req, res) => {
  const { household } = req.body;
  const results = {};
  
  // SNAP
  if (household.income <= rules.snap.incomeLimit[household.size]) {
    results.snap = { eligible: true, monthlyBenefit: rules.snap.maxBenefit[household.size] };
  } else {
    results.snap = { eligible: false };
  }
  
  // Medicaid
  if (household.income <= rules.medicaid.incomeLimit[household.size]) {
    results.medicaid = { eligible: true };
  } else {
    results.medicaid = { eligible: false };
  }
  
  // CHIP
  const childrenUnder18 = household.children || 0;
  if (childrenUnder18 > 0 && household.income <= rules.chip.incomeLimit[household.size]) {
    results.chip = { eligible: true, coveredChildren: childrenUnder18 };
  } else {
    results.chip = { eligible: false };
  }
  
  // WIC
  const hasInfants = household.infants || 0;
  if (hasInfants > 0 && household.income <= rules.wic.incomeLimit[household.size]) {
    results.wic = { eligible: true };
  } else {
    results.wic = { eligible: false };
  }
  
  res.json(results);
});

const PORT = 3002;
app.listen(PORT, () => console.log(`BenefitsNavigator API on port ${PORT}`));
