 import React, { useEffect, useState } from 'react';
import { Box, Typography, Rating, Button, TextField, Avatar, Divider, LinearProgress } from '@mui/material';
import api from '../../../services/api';

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingStats, setRatingStats] = useState({5:0, 4:0, 3:0, 2:0, 1:0});
    const [totalReviews, setTotalReviews] = useState(0);
    
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if(productId) {
            fetchReviews();
            checkEligibility();
        }
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/reviews/${productId}`);
            const data = res.data || [];
            console.log("Reviews from DB:", data); // Check console
            setReviews(data);
            
            if(data.length > 0) {
                let totalStars = 0;
                let validCount = 0;
                let stats = {5:0, 4:0, 3:0, 2:0, 1:0};

                data.forEach(r => {
                    let val = Math.round(Number(r.rating) || 0);
                    // Sirf Valid Ratings count karo (1-5)
                    if (val >= 1 && val <= 5) {
                        totalStars += val;
                        validCount++;
                        if(stats[val] !== undefined) stats[val]++;
                    }
                });

                const avg = validCount > 0 ? (totalStars / validCount).toFixed(1) : "0.0";
                setAverageRating(avg);
                setRatingStats(stats);
                setTotalReviews(validCount);
            } else {
                setAverageRating("0.0");
                setTotalReviews(0);
            }
        } catch (err) {
            console.error("Fetch Error", err);
        }
    };

    const checkEligibility = async () => {
        try {
            const res = await api.get(`/reviews/can-review/${productId}`);
            setCanReview(res.data);
        } catch (err) {
            setCanReview(false);
        }
    };

    const handleSubmit = async () => {
        if (!rating || rating === 0) return alert("Please click stars to rate!");
        setSubmitting(true);
        try {
            await api.post("/reviews/add", { productId, rating, comment });
            alert("Review Added! 🎉");
            setComment(""); setRating(0); setCanReview(false);
            fetchReviews(); 
        } catch (err) {
            alert(err.response?.data || "Error submitting review");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if(!dateString) return "Recent";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "Recent" : date.toLocaleDateString("en-IN", {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <Box className="pdp-reviews-wrapper">
            <Typography variant="h5" fontWeight="800" gutterBottom color="#1e293b">
                Customer Reviews
            </Typography>

            {/* Stats Section */}
            <Box display="flex" flexDirection={{xs:'column', md:'row'}} gap={5} mb={5} alignItems="center">
                <Box textAlign="center" minWidth="200px">
                    <Typography variant="h2" fontWeight="800" color="#f97316" lineHeight="1">
                        {averageRating}
                    </Typography>
                    <Rating value={Number(averageRating) || 0} precision={0.1} readOnly sx={{ fontSize: "2.5rem", color: "#faaf00", my: 1 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight="600">
                        Based on {totalReviews} Ratings
                    </Typography>
                </Box>
                <Box flex={1} width="100%">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <Box key={star} display="flex" alignItems="center" gap={2} mb={0.5}>
                            <Typography variant="caption" fontWeight="bold" minWidth="30px">{star} ★</Typography>
                            <LinearProgress 
                                variant="determinate" 
                                value={totalReviews > 0 ? (ratingStats[star] / totalReviews) * 100 : 0} 
                                sx={{ flex: 1, height: 8, borderRadius: 5, bgcolor:'#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#f97316' } }}
                            />
                            <Typography variant="caption" color="text.secondary">{ratingStats[star]}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Write Review Form */}
            {canReview && (
                <Box mb={5} p={3} bgcolor="#fff7ed" borderRadius={3} border="1px dashed #f97316">
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Write a Review</Typography>
                    <Rating value={rating} onChange={(e, v) => setRating(v)} sx={{ fontSize: "3rem", color: "#faaf00", mb: 2 }} />
                    <TextField fullWidth multiline rows={3} placeholder="Write your review..." value={comment} onChange={(e) => setComment(e.target.value)} sx={{ mb: 2, bgcolor:'white' }} />
                    <Button variant="contained" sx={{ bgcolor:'#f97316', fontWeight:'bold' }} onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Review"}
                    </Button>
                </Box>
            )}

            {/* Reviews List */}
            <Box display="flex" flexDirection="column" gap={2}>
                {reviews.length === 0 ? (
                    <Typography color="text.secondary" fontStyle="italic" textAlign="center">No reviews yet.</Typography>
                ) : (
                    reviews.map((review, index) => (
                        <Box key={review.id || index} p={3} bgcolor="white" borderRadius={3} border="1px solid #f1f5f9" boxShadow="0 2px 4px rgba(0,0,0,0.02)">
                            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                                <Avatar sx={{ bgcolor: '#0f172a', fontWeight:'bold' }}>{review.user?.username?.charAt(0).toUpperCase()}</Avatar>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">{review.user?.username || "User"}</Typography>
                                    <Typography variant="caption" color="text.disabled">{formatDate(review.createdAt)}</Typography>
                                </Box>
                                <Typography variant="caption" sx={{ml:'auto', color:'#166534', bgcolor:'#dcfce7', px:1, borderRadius:1}}>Verified Purchase</Typography>
                            </Box>
                            
                            {/* ✅ Visual Debug: Agar rating 0 hai to Error dikhao */}
                            {review.rating > 0 ? (
                                <Rating value={Number(review.rating)} size="small" readOnly sx={{ color: "#faaf00", mb: 1 }} />
                            ) : (
                                <Typography variant="caption" sx={{color:'red', fontWeight:'bold', border:'1px solid red', px:1, borderRadius:1}}>
                                    ⚠️ Invalid Rating Data
                                </Typography>
                            )}
                            
                            <Typography variant="body2" color="#334155">{review.comment}</Typography>
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default ProductReviews;