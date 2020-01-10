import axios from 'axios';

function GetGithubGraphQL( szToken, pData )
{
  return new Promise( function( resolve, reject )
  {
    const bGet = false;
    const szMethod = bGet ? 'get' : 'post';
    const pObject =
    {
      query : pData
    };
    let httpDefaultOpts =
    {
      method:szMethod,
      baseURL: 'https://api.github.com',
      url: '/graphql',
      timeout: 10000,
      params: pObject,
      data: pObject,
      headers: bGet ? {
        "Authorization" : `Bearer ${szToken}`,
        "X-Requested-With": "XMLHttpRequest",
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8"
      } : {
        "Authorization" : `Bearer ${szToken}`,
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    };
    if( bGet )
      delete httpDefaultOpts.data;
    else
      delete httpDefaultOpts.params;

    axios( httpDefaultOpts ).then( ( response ) =>
    {
      if( response.status != 200 )
        reject( [ { message : "response.status != 200, response.status = " + response.status } ] );
      else if( response.data.errors != undefined )
        reject( response.data.errors );
      else
        resolve( response.data.data );
    } ).catch( ( response ) =>
    {
      reject( [ { message : "network error !!!" } ] );
    });
  } );
};

export default GetGithubGraphQL;
