import GetGithubGraphQL from './GithubGraphQL.js'

function DataEncode( data )
{
  return escape( JSON.stringify( data ) );
}

function DataDecode( data )
{
  return JSON.parse( unescape( data ) );
}

class CGithubDatabase
{
  constructor( szToken, szOwner, szRepository, szDatabaseName )
  {
    this.m_szToken = szToken;
    this.m_szOwner = szOwner;
    this.m_szRepository = szRepository;
    this.m_szDatabaseName = szDatabaseName;
    this.m_aryExecute = [];
    this.m_bConnect = false;

    this.m_pUser = null;
    this.m_pRepository = null;
    this.m_szDatabaseID = null;
  }

  Connect()
  {
    const szToken = this.m_szToken;
    const szOwner = this.m_szOwner;
    const szRepository = this.m_szRepository;
    const szDatabaseName = this.m_szDatabaseName;
    const This = this;
    return new Promise( function( resolve, reject )
    {
      const szData = `query{
user(login:"${szOwner}"){
  id
  name
}
repository(owner:"${szOwner}", name:"${szRepository}"){
  id
  name
  label(name:"${szDatabaseName}"){
    id
    name
  }
}
}`;
      GetGithubGraphQL( szToken, szData ).then( function( data ) {
          const pUser = data.user;
          const pRepository = data.repository;
          const label = pRepository.label;
          if( pUser == null )
            return reject( [ { message : "user not create : " + szOwner } ] );
          This.m_pUser =
          {
            id : pUser.id,
            name : pUser.name,
          };
          if( pRepository == null )
            return reject( [ { message : "repository not create : " + This.m_szRepository } ] );
          This.m_pRepository =
          {
            id : pRepository.id,
            name : pRepository.name,
          };
          if( label == null )
            return reject( [ { message : "label not create : " + This.m_szDatabaseName } ] );
          This.m_szDatabaseID = label.id;
          This.m_bConnect = true;
          resolve();
        },
        function( errors )
        {
          reject( errors );
        },
      );
    } );
  }

  AddData( pData )
  {
    const pUser = this.m_pUser;
    const szToken = this.m_szToken;
    const pRepository = this.m_pRepository;
    const szDatabaseID = this.m_szDatabaseID;
    return new Promise( function( resolve, reject )
    {
      const szJson = DataEncode( pData );
      const szData = `mutation {
        createIssue( input: {
          repositoryId : "${pRepository.id}",
          title : "data",
          body : "${szJson}",
          assigneeIds : [ "${pUser.id}" ],
          labelIds : [ "${szDatabaseID}" ]
        } ){
          issue{
            id
            body
            updatedAt
          }
        }
      }`;
      GetGithubGraphQL( szToken, szData ).then( function( data ){
        var pResult = data.createIssue.issue;
        pResult.data = DataDecode( pResult.body );
        resolve( pResult );
      }, reject );
    } );
  }

  DelData( szID )
  {
    const szToken = this.m_szToken;
    return new Promise( function( resolve, reject )
    {
      const szData = `mutation{
        deleteIssue(input:{
          issueId:"${szID}"
        }){
          clientMutationId
        }
      }`;
      GetGithubGraphQL( szToken, szData ).then( resolve, reject );
    } );
  }

  UpdData( szID,  pData )
  {
    const szToken = this.m_szToken;
    return new Promise( function( resolve, reject ){
      const szJson = DataEncode( pData );
      const szData = `mutation{
  updateIssue(input:{ id:"${szID}", body:"${szJson}" }){
    issue{
      id
    }
  }
}`;
      GetGithubGraphQL( szToken, szData ).then( resolve, reject );
    } );
  }

  GetDataCount()
  {
    const szOwner = this.m_szOwner;
    const szToken = this.m_szToken;
    const szRepository = this.m_szRepository;
    const szDatabaseName = this.m_szDatabaseName;
    return new Promise( function( resolve, reject )
    {
      const szData = `query{
  repository(owner:"${szOwner}", name:"${szRepository}"){
      issues(labels:"${szDatabaseName}"){
      totalCount
    }
  }
}`;
      GetGithubGraphQL( szToken, szData ).then( function( response )
      {
        console.log( response );
        resolve();
      }, reject );
    } );
  }

  GetDataAfter( szID, nNumber )
  {
    const szOwner = this.m_szOwner;
    const szToken = this.m_szToken;
    const szRepository = this.m_szRepository;
    const szDatabaseName = this.m_szDatabaseName;

    szID = szID ? `"${szID}"` : 'null';
    return new Promise( function( resolve, reject )
    {
      const szData = `query{
  repository(owner:"${szOwner}", name:"${szRepository}"){
    issues(labels:"${szDatabaseName}", first:${nNumber}, after:${szID}){
      edges{
        cursor
        node{
          id
          body
          updatedAt
        }
      }
    }
  }
}`;
      GetGithubGraphQL( szToken, szData ).then( function( data ) {
        const edges = data.repository.issues.edges;
        var pResult = [];
        for( var i = 0; i < edges.length; ++i )
        {
          var cursor = edges[i].cursor;
          var node = edges[i].node;
          node.data = DataDecode( node.body );
          node.github_cursor = cursor;
          pResult.push( node );
        }
        resolve( pResult );
      }, reject );
    } );
  }

  GetAllData()
  {
    const This = this;
    return new Promise( function( resolve, reject )
    {
      var ObjectData = [];
      var call = function( szID, nNumber, resolve, reject )
      {
        This.GetDataAfter( szID, nNumber ).then( function( data ){
          for( var i = 0; i < data.length; ++i )
          {
            ObjectData.push( data[i] );
          }
          if( data.length == 0 )
            resolve( ObjectData );
          else
            call( data[data.length-1].github_cursor, nNumber, resolve, reject );
        }, function( errors ){
          reject( errors );
        } );
      }
      call( null, 100, resolve, reject );
    } );
  }
}

export default CGithubDatabase;

/**
 * const szToken = '093db1900b1f076c47733fbf000c44749162c04f';
 * const szOwner = 'lance-loong';
 * const szRepository = 'WeeklyGym';
 * const szDatabaseName = 'database';
 * const pDatabase = new CGithubDatabase( szToken, szOwner, szRepository, szDatabaseName );
*/
