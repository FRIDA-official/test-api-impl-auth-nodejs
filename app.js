const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors());
const port = process.env.PORT || 3000;
const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://frida-demo.okta.com/oauth2/default',
  assertClaims: {
    'scp.includes': ['profile', 'RenteKalkulieren']
  }
});

app.post('/v2/RentenKalkulation', (req, res) => {
    if(req.headers.authorization){
      TokenArray = req.headers.authorization.split(" ");
      oktaJwtVerifier.verifyAccessToken(TokenArray[1], "api://default")
      .then(jwt => {
          res.json({
            summe: {
              betrag: getRandomIntRente(100,2000),
              'währung': "EUR"
            },
            timestamp: Date.now()
          });
      })
          .catch(err => {
            console.warn('token failed validation');
            res.status(403).json({
              error: "invalid request"
            });
      });
    }else {
      res.status(403).json({
        error: "invalid request"
      });
    }
});

function getRandomIntRente(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); 
}

app.listen(port, () => {
  console.log(`FRIDA demo backend listening at http://localhost:${port}`)
})