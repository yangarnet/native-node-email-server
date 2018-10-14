
import helper from './utils/helper';
import handler from './handler';

const routerConfig = {
    email: handler.email
};

const router = (req, res) =>
                helper.isLoadingStaticResources(req.url.trim()) ?
                helper.loadingStaticResouces(req, res) :
                helper.loadRequestPayload(req, res, routerConfig, handler);

export default router;
