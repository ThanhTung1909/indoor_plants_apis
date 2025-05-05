import { Router } from "express"; // Import Router từ express
import {createReview,getReviewsByPlant, deleteReview,} from '../controllers/review.controllers';

const router: Router = Router();

router.post('/add', createReview);
router.get('/plant/:plant_id', getReviewsByPlant);

router.delete('/:reviewId', deleteReview);

export const reviewRouter: Router = router;

