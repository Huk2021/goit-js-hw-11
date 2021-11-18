import axios from 'axios';

const KEY = '24371745-e1c4a52fce1aadc8860478c5a';
const BASE_URL = 'https://pixabay.com/api';

export async function searchImages(userRequest, page, perPage) {
    return await axios.get(`${BASE_URL}/?key=${KEY}&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`,);
     
}

