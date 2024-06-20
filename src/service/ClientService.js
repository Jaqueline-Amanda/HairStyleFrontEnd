import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

export default class ClientService {

    static async create(clientDto) {
        console.log(clientDto)
        const response = await api.post(`/clients`, clientDto);
        return response.data;
      }

    static async getAll() {
        const response = await api.get(`/clients`);
        return response.data;
    }

    static async getById(id) {
        const response = await api.get(`/clients/${id}`);
        return response.data;
    }

    static async updateClient(clientDto) {
        const response = await api.put(`/clients`, clientDto);
        return response.data;
    }

    static async deleteClient(id) {
        const response = await api.delete(`/clients/${id}`);
        return response.data;
    }
}
