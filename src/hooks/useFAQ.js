import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = '/api/faq';

export function useFAQList() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setFaqs(Array.isArray(res.data) ? res.data : []))
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, []);

  return { faqs, loading };
}

export function useFAQActions() {
  const createFAQ = async (faq) => {
    await axios.post(API_URL, faq);
  };
  const updateFAQ = async (faq) => {
    await axios.put(API_URL, faq);
  };
  const deleteFAQ = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  };
  return { createFAQ, updateFAQ, deleteFAQ };
} 