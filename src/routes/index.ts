import express from 'express';
import authRoute from './auth.route';

const router = express.Router()

router.get('/', (req, res) => {
    res.json({msg: 'Initial page'});
})

const subRoutes = [
    {
        path: '/auth',
        route: authRoute
    }
];

subRoutes.forEach((r) => {
    router.use(r.path, r.route);
});

export default router