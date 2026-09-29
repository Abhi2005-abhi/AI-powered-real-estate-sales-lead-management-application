const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}

const handleResponse = async (response) => {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        // Map specific Http Status ranges securely hiding stack trace leakage
        let errorMessage = data?.message || 'An unexpected error occurred.';

        if (response.status === 429) {
            errorMessage = 'You are making too many requests. Please slow down and try again.';
        } else if (response.status >= 500) {
            if (errorMessage.includes("API_KEY") || response.status === 503) {
                errorMessage = 'AI analysis is temporarily unavailable. Please try again later.';
            } else {
                errorMessage = 'The server encountered an error processing your request. Please try again.';
            }
        }

        throw new ApiError(errorMessage, response.status);
    }

    return data;
};

export const apiClient = {
    get: async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError('Unable to connect to the server. Please check your internet connection.', 0);
        }
    },

    post: async (endpoint, payload = {}) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError('Unable to connect to the server. Please check your internet connection.', 0);
        }
    }
};
