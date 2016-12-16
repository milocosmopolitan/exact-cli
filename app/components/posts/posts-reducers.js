import axios from 'axios';
/*
 * ACTIONS & ACTION CREATOR
 * ==============================
 *  
 *   documentation: 	http://redux.js.org/docs/basics/Actions.html
 *
 *   action example: 	
 *			const ACTION_NAME = 'ACTION_NAME'
 *
 *   action-creator example: 
 *			const actioncreatorName = data => ({ type: ACTION_NAME, data });
 */

/* ACTIONS */
const INITIALIZE = 'INITIALIZE_POSTS';
const CREATE     = 'CREATE_POST';
const REMOVE     = 'REMOVE_POST';
const UPDATE     = 'UPDATE_POST';

/* ACTION CREATOR */
const init   = posts => ({ type: INITIALIZE, posts });
const create = post   => ({ type: CREATE, post });
const remove = id      => ({ type: REMOVE, id });
const update = post   => ({ type: UPDATE, post });

/* DISPATCHERS */

export const fetchStories = () => dispatch => {
    axios.get('/api/stories')
         .then(res => dispatch(init(res.data)))
         .catch(err => console.error('Fetching stories unsuccesful', err));
};

// optimistic
export const removeStory = id => dispatch => {
    dispatch(remove(id));
    axios.delete(`/api/stories/${id}`)
         .catch(err => console.error(`Removing story: ${id} unsuccesful`, err));
};

export const addStory = story => dispatch => {
    axios.post('/api/stories', story)
         .then(res => dispatch(create(res.data)))
         .catch(err => console.error(`Creating story: ${story} unsuccesful`, err));
};

export const updateStory = (id, story) => dispatch => {
    axios.put(`/api/stories/${id}`, story)
         .then(res => dispatch(update(res.data)))
         .catch(err => console.error(`Updating story: ${story} unsuccesful`, err));
};

/*
 * INITIAL STATE FOR CURRENT REDUCER
 * ==================================
 *
 *   documentation: http://redux.js.org/docs/basics/Reducers.html
 */

const initialPostState = []

export default function reducer (posts = initialPostState, action) {
  switch (action.type) {

    case INITIALIZE:
      return action.posts;

    case CREATE:
      return [action.post, ...posts];

    case REMOVE:
      return posts
        .filter(post => post.id !== action.id);

    case UPDATE:
      return posts
        .map(post => (
          action.post.id === post.id ? action.post : post
        ));

    default:
      return posts;
  }
}


