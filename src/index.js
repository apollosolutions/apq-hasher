import { print } from 'graphql'
import { __assign, __spreadArray } from 'tslib'
import { gql } from 'graphql-tag'
import { addTypenameToDocument, sha } from './utils'
import { usageReportingSignature } from '@apollo/utils.usagereporting'
import crypto from 'crypto'

const copyText = (e) => {
  const text = e.target.innerText;
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log(`Copied ${text} to clipboard`);
    })
    .catch(err => {
      console.error('Failed to copy text: ', err);
    });
  alert("Copied to clipboard!");
}

const hashitButton = document.getElementById('hashit')
const apqHashDiv = document.getElementById('apqHash')
const studioOpsDiv = document.getElementById('studioOperationId')
const queryIdDiv = document.getElementById('queryId')
const rawQueryTextarea = document.getElementById('rawQuery')
const printedTextarea = document.getElementById('printed')

apqHashDiv.addEventListener("click", copyText);
studioOpsDiv.addEventListener("click", copyText);
queryIdDiv.addEventListener("click", copyText);

hashitButton.addEventListener('click', (e) => {
  const addTypenameInput = document.getElementById('addTypename')
  const queryDoc = gql(rawQueryTextarea.value)

  const operationName = "GetAccount"

// see https://github.com/apollographql/apollo-utils/blob/main/packages/usageReporting/src/signature.ts
  const sig = usageReportingSignature(queryDoc)

  const queryId = crypto
    .createHash("sha1")
    .update(`# ${operationName ?? "-"}\n${sig}`)
    .digest("hex");

  const studioOperationHash = queryId.slice(queryId.length - 4)
  
  let typed = queryDoc
  if (addTypenameInput.checked) {
    typed = addTypenameToDocument(queryDoc)
  }

  const prettified = print(typed)
  const APQHash = sha(prettified)
  apqHashDiv.innerText = APQHash
  studioOpsDiv.innerText = studioOperationHash
  queryIdDiv.innerText = queryId
  printedTextarea.value = prettified

  console.log(JSON.stringify({ queryId, studioOperationHash, APQHash }, null, 2));
})
