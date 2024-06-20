import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

export default class HairdresserService {

    static async create(hairdresserDto) {
        console.log(hairdresserDto)
        const response = await api.post(`/hairdressers`, hairdresserDto);
        return response.data;
      }

    static async getAll() {
        const response = await api.get(`/hairdressers`);
        return response.data;
    }

    static async getById(id) {
        const response = await api.get(`/hairdressers/${id}`);
        return response.data;
    }

    static async updateHairdresser(hairdresserDto) {
        const response = await api.put(`/hairdressers`, hairdresserDto);
        return response.data;
    }

    static async deleteHairdresser(id) {
        const response = await api.delete(`/hairdressers/${id}`);
        return response.data;
    }
}
