import { visit } from 'graphql'
import { __assign, __spreadArray } from 'tslib'
import { createHash } from 'crypto'

export const sha = (s) => {
  return createHash('sha256').update(s).digest('hex')
}

const isField = (selection) => {
  return selection.kind === 'Field'
}

const TYPENAME_FIELD = {
  kind: 'Field',
  name: {
    kind: 'Name',
    value: '__typename'
  }
}

export const addTypenameToDocument = Object.assign(
  function (doc) {
    return visit(doc, {
      SelectionSet: {
        enter: function (node, _key, parent) {
          if (parent && parent?.kind === 'OperationDefinition') {
            return
          }
          var selections = node.selections
          if (!selections) {
            return
          }
          var skip = selections.some(function (selection) {
            return (
              isField(selection) &&
              (selection.name.value === '__typename' ||
                selection.name.value.lastIndexOf('__', 0) === 0)
            )
          })
          if (skip) {
            return
          }
          var field = parent
          if (
            isField(field) &&
            field?.directives &&
            field?.directives.some(function (d) {
              return d.name.value === 'export'
            })
          ) {
            return
          }
          return __assign(__assign({}, node), {
            selections: __spreadArray(
              __spreadArray([], selections, true),
              [TYPENAME_FIELD],
              false
            )
          })
        }
      }
    })
  },
  {
    added: function (field) {
      return field === TYPENAME_FIELD
    }
  }
)

export const getOperationName = (operationDoc) => {
  const node = operationDoc.definitions.find(e => e.kind === 'OperationDefinition');
  if (!node) {
    throw "Unknown operation name";
  }
  return node.name.value;
}
