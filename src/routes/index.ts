import express from 'express';
import rustRoute from './rust.route';

const router = express.Router()

router.get('/', (req, res) => {
    res.json({msg: 'Initial page', sessionID: req.sessionID});
})

const subRoutes = [
    {
        path: '/rust',
        route: rustRoute
    },
];

subRoutes.forEach((r) => {
    router.use(r.path, r.route);
});

export default router