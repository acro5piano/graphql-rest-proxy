export interface GraphQLName {
  kind: 'Name'
  value: string
}

export interface GraphQLArgument {
  name: GraphQLName
  type: GraphQLType
  value: {
    value: string
  }
}

export interface GraphQLDirective {
  kind: 'Directive'
  name: GraphQLName
  arguments: GraphQLArgument[]
}

export interface GraphQLInterface {}

export interface GraphQLType {
  kind: 'NamedType' | 'NonNullType' | 'TypedName' | 'Name' | 'ListType'
  name?: string | GraphQLName
  type?: GraphQLType
}

export type GraphQLKind =
  | 'Document'
  | 'ObjectTypeDefinition'
  | 'FieldDefinition'
  | 'InputObjectTypeDefinition'

export interface GraphQLField {
  kind: 'FieldDefinition' | 'InputValueDefinition'
  type: GraphQLType
  directives: GraphQLDirective[]
  arguments: GraphQLArgument[]
  name: GraphQLName
  fields: GraphQLField[]
  __resolver: Function
}

export interface GraphQLTree {
  kind: GraphQLKind
  name: GraphQLName
  interfaces: GraphQLInterface[]
  directives: GraphQLDirective[]
  type: GraphQLType
  definitions: GraphQLField[]
  arguments?: any[]
}
