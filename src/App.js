import React from 'react';
import logo from './logo.svg';
import './App.css';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
import {ApolloClient} from "apollo-client"
import {ApolloProvider, Mutation} from "react-apollo"
import gql from "graphql-tag"

const apolloCache = new InMemoryCache()

const uploadLink = createUploadLink({
  uri: 'https://cms.connect.prosple.com.feature-data-capture-as7da7a-wpi42jvaqgg5e.au.platformsh.site/graphql', // Apollo Server is served from port 4000
  headers: {
    "keep-alive": "true"
  }
})

const client = new ApolloClient({
  cache: apolloCache,
  link: uploadLink
})

const UPLOAD_FILE = gql`
  mutation SingleUpload($file: Upload!) {
    webformFileUpload(file: $file, webform_id: "contact", webform_element_id: "upload_your_cv") {
      entity {
        entityId
      }
      fid
      errors
    }
  }
`;


function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Save Local</h2>
                <Mutation mutation={UPLOAD_FILE}>
                    {(singleUpload, { data, loading }) => {
                        console.log(data)
                        return (
                          <form onSubmit={() => {console.log("Submitted")}} encType={'multipart/form-data'}>
                            <input name={'document'} type={'file'} onChange={({target: { files }}) => {
                              const file = files[0]
                              file && singleUpload({ variables: { file: file } })
                            }}/>
                            {loading && <p>Loading.....</p>}
                            {data?.webformFileUpload?.errors?.length && "Error!!"}
                            {data?.webformFileUpload?.entity?.entityId && "Success!"}
                          </form>
                        )}
                    }
                </Mutation>
        </header>
      </ApolloProvider>
    </div>
  );
}

export default App;