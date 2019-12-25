import { Op } from 'sequelize';
import { Response } from 'express';
import UserLoginHistory from '@/model/entities/userLoginHistory';
import IRequestEditUser from '@/interfaces/User/RequestUser';
import IDatatablesRequest from '@/interfaces/Datatables/Request';
import IDatatablesResponse from '@/interfaces/Datatables/Response';
import app from '@/app';

type entry = [Date, string, string, string];

async function LoginHistory(req: IRequestEditUser, res: Response): Promise<void> {
  try {
    const request: IDatatablesRequest = req.query;
    const response: IDatatablesResponse<entry> = {
      draw: request.draw,
      recordsTotal: 0,
      recordsFiltered: 0,
      data: []
    };

    // Prepare filter
    if (request.columns[0].search.value.length === 0) {
      throw new Error('Date is empty');
    }
    const range: string[] = request.columns[0].search.value.split(' - ');
    const where = {
      userId: req.editUser.id,
      createdAt: {
        [Op.gte]: range[0],
        [Op.lte]: range[1]
      },
      [Op.or]: [
        { address: { [Op.like]: `%${request.search.value}%` } },
        { browser: { [Op.like]: `%${request.search.value}%` } },
        { os: { [Op.like]: `%${request.search.value}%` } }
      ]
    };

    // Sort entries
    const columnsNames: string[] = ['createdAt', 'address', 'browser', 'os'];

    // Get history entries from database
    response.data = await UserLoginHistory.findAll({
      attributes: ['createdAt', 'address', 'browser', 'os'],
      where,
      offset: request.start,
      limit: request.length,
      order: [[columnsNames[request.order[0].column], request.order[0].dir.toUpperCase()]],
      raw: true
    }).map((entry: UserLoginHistory): entry => [entry.createdAt, entry.address, entry.browser, entry.os]);

    // Get total reports
    response.recordsTotal = await UserLoginHistory.count({
      where: {
        userId: req.editUser.id
      }
    });
    response.recordsFiltered = await UserLoginHistory.count({ where });

    res.send(response);
  } catch (err) {
    app.logger.error('An error has occured when trying to get user login history data', req.user.hash, err);
    res.status(500).send();
  }
}
export default LoginHistory;
