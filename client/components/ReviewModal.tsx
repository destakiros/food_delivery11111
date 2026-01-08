
import React, { useState } from 'react';
import { Order } from '../types';

interface ReviewModalProps {
  order: Order;
  onSubmit: (rating: number, comment: string) => void;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ order, onSubmit, onClose }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white rounded-[50px] p-12 max-w-md w-full shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i className="ph-bold ph-star text-3xl"></i>
          </div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Rate Your Experience</h2>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-2">Order #{order.id}</p>
        </div>

        <div className="space-y-8">
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star} 
                onClick={() => setRating(star)}
                className={`text-4xl transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
              >
                <i className={`ph-fill ph-star`}></i>
              </button>
            ))}
          </div>

          <textarea 
            className="w-full bg-gray-50 border-0 rounded-3xl p-6 text-sm font-medium h-32 outline-none focus:ring-2 focus:ring-red-600 resize-none"
            placeholder="HOW WAS THE TASTE? ANY FEEDBACK FOR THE KITCHEN?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          <div className="flex gap-4">
            <button onClick={onClose} className="flex-grow bg-gray-100 text-gray-400 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition">Skip</button>
            <button 
              onClick={() => onSubmit(rating, comment)}
              className="flex-grow bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-100 hover:bg-red-700 transition"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
