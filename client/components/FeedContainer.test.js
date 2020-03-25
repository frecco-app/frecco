import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import FeedContainer from './FeedContainer';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  filteredPosts: [
    {
      category: 'Food',
      created_by: 29,
      id: 193,
      likes: 0,
      location: '2nd Avenue, New York, NY, USA',
      locationDetail: "Joey Pepperoni's Pizza",
      rating: 5,
      recommendation: 'Zac',
      review_text: 'Food of the gods',
      username: 'zach'
    }
  ],
  likedPosts: []
};

const setup = (props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  return shallow(<FeedContainer {...setupProps} />);
};

// const setupMount = (props = {}) => {
//   const setupProps = { ...defaultProps, ...props };
//   return mount(<FeedContainer {...setupProps} />);
// };

// Renders w/o error
it('renders without error', () => {
  const wrapper = setup();
  const feedContainer = wrapper.find('#feed-container');
  expect(feedContainer.length).toBe(1);
});

// Renders no items when filteredPosts is empty
it('renders no feedItem components when filteredPosts is empty', () => {
  const wrapper = setup({ filteredPosts: [] });
  const feedContainer = wrapper.find('#feed-container');
  expect(feedContainer.children().length).toBe(0);
});

// Renders children when filteredPosts is populated
it('renders feedItem component when filteredPost contains post data', () => {
  const wrapper = setup();
  const feedContainer = wrapper.find('#feed-container');
  expect(feedContainer.children().length).toBe(1);
});
