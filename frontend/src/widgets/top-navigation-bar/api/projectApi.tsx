import axios from 'axios';

export const projectApi = {
  getProjectDetail: async (projectId: number) => {
    // const response = await api.get(`/projects/${projectId}`);

    const response = await axios.get('https://dummyjson.com/c/8863-456d-4c9c-82f4');

    console.log(projectId);
    console.log(response.data);

    return response.data;
  },
};
