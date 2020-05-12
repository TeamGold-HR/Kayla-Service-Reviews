/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import React from 'react';
import axios from 'axios';
import styled from 'styled-components';

import ReviewList from './ReviewList';
import Overview from './Overview';

const Title = styled.h2`
  color: rgb(72, 72, 72);
  font-family:  Circular, -apple-system, Roboto, "Helvetica Neue", sans-serif;
  font-weight: 500;
  padding: 5px;
`;

const Container = styled.div`
  display: flex;
  width: auto;
  flex-direction: column;
  margin-left: 4%;
  max-width: 696px !important;
  // margin-left: auto !important;
  // margin-right: auto !important;
  // padding-right: 24px !important;
  // padding-left: 24px !important;
`;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reviews: [],
      displayedReviews: [],
      hasReview: null,
      clicked: false,
      isSearching: false,
    };

    this.onSearch = this.onSearch.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    let listingId;
    const { pathname } = window.location;

    if (pathname === '/index.html/') {
      listingId = 0;
    } else {
      listingId = pathname.slice(1, pathname.length - 1);
    }

    if (Number(listingId) !== 'NaN') {
      axios.get(`/reviews/${listingId}`)
        .then(({ data }) => {
          this.setState({ reviews: data });
        })
        .catch((err) => console.log(err));
    }
  }

  onSearch({ searchQuery }) {
    const searchedReviews = [];
    const { reviews, hasReview } = this.state;
    // eslint-disable-next-line guard-for-in
    for (const currentReview of reviews) {
      if (currentReview.review.toLowerCase().includes(searchQuery.toLowerCase())) {
        searchedReviews.push(currentReview);
      }
    }

    if (!hasReview) {
      this.setState({ hasReview: true });
    }

    this.setState({ searchQuery, isSearching: true });
    if (searchedReviews.length >= 1) {
      this.setState({ displayedReviews: searchedReviews });
    } else {
      this.setState({ hasReview: false });
    }
  }

  handleClick(click) {
    const { reviews } = this.state;

    const { isSearching } = this.state;
    this.setState({
      clicked: !click,
      displayedReviews: reviews,
      hasReview: null,
      isSearching: !isSearching,
    });
  }

  render() {
    const {
      reviews,
      displayedReviews,
      hasReview,
      searchQuery,
      clicked,
      isSearching,
    } = this.state;

    return (
      <Container>
        <Title>Reviews</Title>
        <Overview
          reviews={reviews}
          onSearch={this.onSearch}
          searchQuery={searchQuery}
          hasReview={hasReview}
          length={reviews.length}
          handleClick={this.handleClick}
          clicked={clicked}
          displayedReviews={displayedReviews}
          isSearching={isSearching}
        />

        <ReviewList
          hasReview={hasReview}
          reviews={displayedReviews.length === 0 ? reviews : displayedReviews}
        />
      </Container>
    );
  }
}

export default App;
