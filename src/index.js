import { print } from 'graphql'
import { __assign, __spreadArray } from 'tslib'
import { gql } from 'graphql-tag'
import { addTypenameToDocument, sha } from './utils'

const hashitButton = document.getElementById('hashit')
const hashDiv = document.getElementById('hash')
const rawQueryTextarea = document.getElementById('rawQuery')
const printedTextarea = document.getElementById('printed')

hashitButton.addEventListener('click', (e) => {
  const addTypenameInput = document.getElementById('addTypename')
  const queryDoc = gql(rawQueryTextarea.value)
  
  let typed = queryDoc
  if (addTypenameInput.checked) {
    typed = addTypenameToDocument(queryDoc)
  }

  const prettified = print(typed)
  const hash = sha(prettified)
  console.log('hash: ', hash)
  hashDiv.innerText = hash
  printedTextarea.value = prettified
})
