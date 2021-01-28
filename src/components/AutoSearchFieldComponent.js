import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

class AutoSearchFieldComponent extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array),
  };

  static defaultProps = {
    suggestions: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      currentRepos: 0,
      // The repositories that match the user's input
      filteredRepositories: [],
      // Whether or not the repository list is shown
      showRepositories: false,
      // What the user has entered
      userInput: "",

      userSelection: "",
    };
  }

  onChange = (e) => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

    // Filter our suggestions that don't contain the user's input
    const filteredRepositories = suggestions.filter(
      (suggestion) =>
        suggestion.owner.login.toLowerCase().indexOf(userInput.toLowerCase()) >
        -1
    );

    this.setState({
      currentRepos: 0,
      filteredRepositories,
      showRepositories: true,
      userInput: e.currentTarget.value,
    });
  };

  onClick = (e) => {
    this.setState({
      currentRepos: 0,
      filteredRepositories: [],
      showRepositories: false,
      userInput: e.currentTarget.innerText,
      userSelection: e.currentTarget.innerText,
    });
  };

  onKeyDown = (e) => {
    const { currentRepos, filteredRepositories } = this.state;

    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({
        currentRepos: 0,
        showRepositories: false,
        userInput: filteredRepositories[currentRepos],
        userSelection: filteredRepositories[currentRepos],
      });
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (currentRepos === 0) {
        return;
      }

      this.setState({ currentRepos: currentRepos - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (currentRepos - 1 === filteredRepositories.length) {
        return;
      }

      this.setState({ currentRepos: currentRepos + 1 });
    }
  };

  onBlur = (e) => {
    if (this.state.userSelection === "") {
      this.setState({
        currentRepos: 0,
        filteredRepositories: [],
        showRepositories: false,
        userInput: "",
      });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      onBlur,
      state: {
        currentRepos,
        filteredRepositories,
        showRepositories,
        userInput,
      },
    } = this;

    let reposListComponent;

    if (showRepositories && userInput) {
      if (filteredRepositories.length) {
        reposListComponent = (
          <ul className="reposlist">
            {filteredRepositories.map((repo, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === currentRepos) {
                className = "repo-active";
              }

              return (
                <li className={className} key={repo.name} onClick={onClick}>
                  {"User Name - " +
                    repo.owner.login +
                    ", Repository - " +
                    repo.name}
                </li>
              );
            })}
          </ul>
        );
      } else {
        reposListComponent = (
          <div className="no-reposlist">
            <em>No Repositories found!</em>
          </div>
        );
      }
    }

    return (
      <Fragment>
        <input
          type="text"
          placeholder="Type User Name Here"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
          onBlur={onBlur}
        />
        {reposListComponent}
      </Fragment>
    );
  }
}

export default AutoSearchFieldComponent;
