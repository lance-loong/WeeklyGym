import axios from 'axios';

const szToken = '83b229b1d86efc780ce20d930511ad07c1111361';

function GetGithubGraphQL( bGet, szToken, pData, pCallback )
{
  const szMethod = bGet ? 'get' : 'post';
  let httpDefaultOpts =
  {
    method:szMethod,
    baseURL: 'https://api.github.com',
    url: '/graphql',
    timeout: 10000,
    params: pData,
    data: pData,
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
console.log( httpDefaultOpts );
  if( bGet )
    delete httpDefaultOpts.data;
  else
    delete httpDefaultOpts.params;

  axios( httpDefaultOpts ).then( (response) =>
  {
    pCallback( response, true );
  } ).catch( ( response ) =>
  {
    pCallback( response, false );
  });
};



export default GetGithubGraphQL;
