import React, { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import axios from "axios";
import "./Lab.css";

const LabReviewModal = ({ show, onClose, onSubmit, rating, setRating, comment, setComment }) => {
  if (!show) return null;

  return (
    <div className="lab-modal-overlay">
      <div className="lab-modal-content">
        <h3>Leave a Review</h3>
        <ReactStars
          count={5}
          value={rating}
          onChange={setRating}
          size={30}
          activeColor="#ffd700"
        />
        <textarea
          rows="4"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className="lab-modal-buttons">
          <button onClick={onSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const LabReviews = ({ labId }) => {
  const [reviewData, setReviewData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const userId = localStorage.getItem("userID");

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/labs/reviews?id=${labId}`, {
        withCredentials: true,
      });
      setReviewData(data.reviews);

      const existingReview = data.reviews.find((r) => r.user._id === userId);
      if (existingReview) {
        setRating(existingReview.rating);
        setComment(existingReview.comment);
      }
    } catch (error) {
      console.error("Error fetching reviews", error);
    }
  };

  useEffect(() => {
    if (labId) fetchReviews();
  }, [labId]);

  const submitReview = async () => {
    try {
      await axios.put(
        "/api/labs/reviews",
        {
          rating,
          comment,
          labId,
        },
        {
          withCredentials: true,
        }
      );
      setShowModal(false);
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review", error);
    }
  };

  const averageRating =
    reviewData.reduce((sum, r) => sum + r.rating, 0) / (reviewData.length || 1);

  return (
    <div className="lab-reviews-section">
      <h3>Lab Ratings & Reviews</h3>
      <ReactStars
        count={5}
        value={averageRating}
        size={24}
        edit={false}
        activeColor="#ffd700"
      />
      <div className="lab-review-list">
        {reviewData.map((review, index) => (
          <div key={index} className="lab-review-item">
            <ReactStars
              count={5}
              value={review.rating}
              size={20}
              edit={false}
              activeColor="#ffd700"
            />
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
      <button onClick={() => setShowModal(true)}>Leave/Edit Review</button>
      <LabReviewModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={submitReview}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
      />
    </div>
  );
};

export const Labb = () => {
  const labId = "sample-lab-id"; // Replace this with dynamic labId if needed

  return (
    <div className="lab-details-container">
      <div className="lab-header">
        <img src="/lab-sample.jpg" alt="Lab" className="lab-image" />
        <div className="lab-info">
          <h2>City Diagnostic Lab</h2>
          <p>
            Located in the heart of the city, City Diagnostic Lab provides state-of-the-art
            pathology and radiology services with a team of experienced professionals.
          </p>
          <p>
            <strong>Address:</strong> 123 Health Street, Prayagraj, UP 211001
          </p>
          <p>
            <strong>Fees:</strong> ₹500 - ₹2000 per test
          </p>
        </div>
      </div>
      <LabReviews labId={labId} />
    </div>
  );
};
