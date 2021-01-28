import React, { Component } from "react";
import axios from "axios";
import { GITHUB_V4_API_URL, GITHUB_V4_API_TOKEN } from "../util/constants";
import AutoSearchFieldComponent from "./AutoSearchFieldComponent";

class AutoSearchComponent extends Component {
  render() {
    return (
      <div>
        <h2>Welcome to Github v4 API Consumer</h2>
        {this.state.isLoading ? (
          <div>Loading....</div>
        ) : (
          <AutoSearchFieldComponent suggestions={this.state.repos} />
        )}
      </div>
    );
  }

  state = {
    repos: [],
    isLoading: false,
  };

  componentDidMount() {
    this.loadGitRepos();
  }

  loadGitRepos = () => {
    this.setState({ isLoading: true });
    let graphqlQuery =
      "{viewer {repositories(first: 100, affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {       totalCount       nodes{         name           owner {             login           }         }       }    }  }";
    axios
      .post(
        GITHUB_V4_API_URL,
        {
          query: graphqlQuery,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "bearer " + GITHUB_V4_API_TOKEN,
          },
        }
      )
      .then((result) => {
        console.log(result.data.data.viewer.repositories.nodes);
        this.setState({
          repos: result.data.data.viewer.repositories.nodes,
          isLoading: false,
        });
      })
      .catch((error) =>
        this.setState({
          error,
          isLoading: false,
        })
      );
  };
}
export default AutoSearchComponent;
