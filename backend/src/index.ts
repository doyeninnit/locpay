

// import { newKit } from "@celo/contractkit";
// import { OdisUtils } from "@celo/identity";
// import { AuthSigner, OdisContextName } from "@celo/identity/lib/odis/query";
// async function main() {
//   // the issuer is the account that is registering the attestation
//   let ISSUER_PRIVATE_KEY = "df22c9fc78bb9ddc80605f85ef479330b3f2907a9386835e725d105f07945ecf";

//   // create alfajores contractKit instance with the issuer private key
//   // const kit = await newKit("https://alfajores-forno.celo-testnet.org");
//   const kit = await newKit("https://forno.celo.org");

//   kit.addAccount(ISSUER_PRIVATE_KEY);
//   const issuerAddress =
//     kit.web3.eth.accounts.privateKeyToAccount(ISSUER_PRIVATE_KEY).address;
//   kit.defaultAccount = issuerAddress;

//   // information provided by user, issuer should confirm they do own the identifier
//   const userPlaintextIdentifier = "12398";
//   const userAccountAddress = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";

//   // time at which issuer verified the user owns their identifier
//   const attestationVerifiedTime = Date.now();


//   // authSigner provides information needed to authenticate with ODIS
//   const authSigner: AuthSigner = {
//     authenticationMethod: OdisUtils.Query.AuthenticationMethod.WALLET_KEY,
//     contractKit: kit,
//   };
//   // serviceContext provides the ODIS endpoint and public key
//   const serviceContext = OdisUtils.Query.getServiceContext(OdisContextName.MAINNET);

//   // check existing quota on issuer account
//   const { remainingQuota } = await OdisUtils.Quota.getPnpQuotaStatus(
//     issuerAddress,
//     authSigner,
//     serviceContext
//   );

//   // if needed, approve and then send payment to OdisPayments to get quota for ODIS
//   if (remainingQuota < 1) {
//     const stableTokenContract = await kit.contracts.getStableToken();
//     const odisPaymentsContract = await kit.contracts.getOdisPayments();
//     const ONE_CENT_CUSD_WEI = "10000000000000000";
//     await stableTokenContract
//       .increaseAllowance(odisPaymentsContract.address, ONE_CENT_CUSD_WEI)
//       .sendAndWaitForReceipt();
//     const odisPayment = await odisPaymentsContract
//       .payInCUSD(issuerAddress, ONE_CENT_CUSD_WEI)
//       .sendAndWaitForReceipt();
//     console.log("quota done")
//   }

//   // get obfuscated identifier from plaintext identifier by querying ODIS
//   const { obfuscatedIdentifier } =
//     await OdisUtils.Identifier.getObfuscatedIdentifier(
//       userPlaintextIdentifier,
//       OdisUtils.Identifier.IdentifierPrefix.TILL,
//       issuerAddress,
//       authSigner,
//       serviceContext
//     );

//   console.log(` ob Identifier - ${obfuscatedIdentifier}`)
//   const federatedAttestationsContract =
//     await kit.contracts.getFederatedAttestations();

//   // First, check if an attestation already exists
//   const attestations = await federatedAttestationsContract.lookupAttestations(
//     obfuscatedIdentifier,
//     [issuerAddress]
//   );

//   if (attestations && attestations.accounts && attestations.accounts.length > 0) {
//     console.log("Attestation already exists. Skipping registration.");
//     console.log(obfuscatedIdentifier)
//     console.log("attest - ", attestations);
//     console.log("aacc - ", attestations.accounts);
//   } else {
//     // If no attestation exists, proceed to register
//     try {
//       await federatedAttestationsContract
//         .registerAttestationAsIssuer(
//           obfuscatedIdentifier,
//           userAccountAddress,
//           attestationVerifiedTime
//         )
//         .send();
//       console.log("Attestation registered successfully.");

//       console.log("attest - ", attestations);
//       console.log("aacc - ", attestations.accounts);
//     } catch (error) {
//       console.error("Error registering attestation:", error);
//     }
//   }

// }

// main()


import express from 'express';
import { newKit } from "@celo/contractkit";
import { OdisUtils } from "@celo/identity";
import { AuthSigner, OdisContextName } from "@celo/identity/lib/odis/query";
import mongoose from 'mongoose';
import { config } from "dotenv";
// import { cors } from 'cors';
const cors = require('cors');

import Merchant from './models';
config()


// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI as string;


mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Celo kit and related setup
const kit = newKit("https://forno.celo.org");
const ISSUER_PRIVATE_KEY = process.env.ISSUER_PRIVATE_KEY as string;
kit.addAccount(ISSUER_PRIVATE_KEY);
const issuerAddress = kit.web3.eth.accounts.privateKeyToAccount(ISSUER_PRIVATE_KEY).address;
kit.defaultAccount = issuerAddress;

const authSigner: AuthSigner = {
  authenticationMethod: OdisUtils.Query.AuthenticationMethod.WALLET_KEY,
  contractKit: kit,
};

const serviceContext = OdisUtils.Query.getServiceContext(OdisContextName.MAINNET);

// Function to generate a unique 5-digit till number
const generateTillNumber = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};



app.post('/registerMerchant', async (req, res) => {
  const { walletAddress, businessName } = req.body;  // Added businessName

  if (!walletAddress) {
    return res.status(400).send({ error: 'Wallet address is required' });
  }

  if (!businessName) {
    return res.status(400).send({ error: 'Business name is required' });  // Validation for business name
  }

  const tillNumber = generateTillNumber();

  //   // check existing quota on issuer account
  const { remainingQuota } = await OdisUtils.Quota.getPnpQuotaStatus(
    issuerAddress,
    authSigner,
    serviceContext
  );

  // if needed, approve and then send payment to OdisPayments to get quota for ODIS
  if (remainingQuota < 1) {
    const stableTokenContract = await kit.contracts.getStableToken();
    const odisPaymentsContract = await kit.contracts.getOdisPayments();
    const ONE_CENT_CUSD_WEI = "10000000000000000";
    await stableTokenContract
      .increaseAllowance(odisPaymentsContract.address, ONE_CENT_CUSD_WEI)
      .sendAndWaitForReceipt();
    const odisPayment = await odisPaymentsContract
      .payInCUSD(issuerAddress, ONE_CENT_CUSD_WEI)
      .sendAndWaitForReceipt();
    console.log("quota done")
  }
  // Generate obfuscated identifier for the till number
  const { obfuscatedIdentifier } = await OdisUtils.Identifier.getObfuscatedIdentifier(
    tillNumber,
    OdisUtils.Identifier.IdentifierPrefix.TILL,
    issuerAddress,
    authSigner,
    serviceContext
  );

  // Get the FederatedAttestations contract
  const federatedAttestationsContract = await kit.contracts.getFederatedAttestations();

  // Time of attestation verification
  const attestationVerifiedTime = Date.now();

  try {
    // Register the attestation
    await federatedAttestationsContract
      .registerAttestationAsIssuer(
        obfuscatedIdentifier,
        walletAddress,
        attestationVerifiedTime
      )
      .send({ from: issuerAddress });

    // Here, store the tillNumber, walletAddress, and businessName mapping in a database
    const merchant = new Merchant({
      walletAddress: walletAddress,
      businessName: businessName,
      tillNumber: tillNumber,
      obfuscatedIdentifier: obfuscatedIdentifier,
    });
    await merchant.save();

    return res.status(200).send({ tillNumber, walletAddress, businessName, obfuscatedIdentifier });
  } catch (error) {
    console.error("Error registering attestation:", error);
    return res.status(500).send({ error: 'Failed to register attestation' });
  }
});



// app.get('/getMerchantAddress/:tillNumber', async (req, res) => {
//   const { tillNumber } = req.params;

//   try {
//     // Query the database for the merchant using the tillNumber
//     const merchant = await Merchant.findOne({ tillNumber });

//     if (!merchant) {
//       return res.status(404).send({ error: 'No merchant found with the given till number' });
//     }

//     // Extract walletAddress and businessName from the merchant document
//     const { walletAddress, businessName } = merchant;

//     // Return walletAddress and businessName
//     return res.status(200).send({ walletAddress, businessName });
//   } catch (error) {
//     console.error("Error retrieving merchant data:", error);
//     return res.status(500).send({ error: 'Failed to retrieve merchant data' });
//   }
// });


app.post('/pay', async (req, res) => {
  const { tillNumber, confirm } = req.body; // Extracting tillNumber as businessUniqueCode and confirm flag

  try {
    // Query the database for the merchant using the tillNumber
    const merchant = await Merchant.findOne({ tillNumber: tillNumber });

    if (!merchant) {
      return res.status(404).send({ error: 'No merchant found with the given till number' });
    }

    // Extract walletAddress and businessName from the merchant document
    const { walletAddress, businessName } = merchant;

    if (!confirm) {
      // If not confirming, just return the business name for the user to confirm
      return res.status(200).send({ businessName });
    } else {
      // If confirming, return the wallet address of the merchant
      // This is where you would also handle the actual payment transaction
      // (the payment processing logic should be implemented here)

      return res.status(200).send({ walletAddress });
    }
  } catch (error) {
    console.error("Error in payment process:", error);
    return res.status(500).send({ error: 'Failed to process payment' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
