import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import FeedItem from './FeedItem';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
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
};

const setup = (props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  return shallow(<FeedItem {...setupProps} />);
};

it('renders without error', () => {
  const wrapper = setup();
  const feedItem = wrapper.find('.feed-item');
  expect(feedItem.length).toBe(1);
});

it('renders four div children', () => {
  const wrapper = setup();
  const feedItem = wrapper.find('.feed-item');
  expect(feedItem.children().find('div').length).toBe(4);
});

describe('renders heart icon correctly', () => {
  it('renders heart outline & not filled heart when `isLiked` prop is false', () => {
    const wrapper = setup();
    const heartOutline = wrapper.find('AiOutlineHeart');
    const filledHeart = wrapper.find('AiFillHeart');
    expect(heartOutline.length).toBe(1);
    expect(filledHeart.length).toBe(0);
  });
  it('renders filled heart & not heart outline when `isLiked prop is true`', () => {
    const wrapper = setup({ isLiked: true });
    const heartOutline = wrapper.find('AiOutlineHeart');
    const filledHeart = wrapper.find('AiFillHeart');
    expect(heartOutline.length).toBe(0);
    expect(filledHeart.length).toBe(1);
  });
});
