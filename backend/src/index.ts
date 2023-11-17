

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

// Initialize Express
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;

// Celo kit and related setup
const kit = newKit("https://forno.celo.org");
const ISSUER_PRIVATE_KEY = "df22c9fc78bb9ddc80605f85ef479330b3f2907a9386835e725d105f07945ecf"; 
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
  const { walletAddress }: any = req.body;
  if (!walletAddress) {
    return res.status(400).send({ error: 'Wallet address is required' });
  }

  const tillNumber = generateTillNumber();

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

    // Here, store the tillNumber and walletAddress mapping in a database
    // Assuming the mapping is stored successfully

    return res.status(200).send({ tillNumber, walletAddress, obfuscatedIdentifier });
  } catch (error) {
    console.error("Error registering attestation:", error);
    return res.status(500).send({ error: 'Failed to register attestation' });
  }
});



app.get('/getMerchantAddress/:tillNumber', async (req, res) => {
  const { tillNumber } = req.params;

  // Here, you would look up the wallet address using the till number from your database
  // Let's assume you've successfully retrieved the wallet address
  const userAccountAddress = '0x...'; // Retrieved wallet address
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
  // Get obfuscated identifier
  const { obfuscatedIdentifier } = await OdisUtils.Identifier.getObfuscatedIdentifier(
    tillNumber,
    OdisUtils.Identifier.IdentifierPrefix.TILL,
    issuerAddress,
    authSigner,
    serviceContext
  );

  // Lookup attestations
  const federatedAttestationsContract = await kit.contracts.getFederatedAttestations();
  const attestations = await federatedAttestationsContract.lookupAttestations(
    obfuscatedIdentifier,
    [issuerAddress]
  );

  if (attestations.accounts && attestations.accounts.length > 0) {
    return res.status(200).send({ merchantAddress: attestations.accounts[0] });
  } else {
    return res.status(404).send({ error: 'No merchant found with the given till number' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
