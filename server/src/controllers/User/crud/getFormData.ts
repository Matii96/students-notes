import Role from '@/model/entities/role';
import app from '@/app';
import IBaseEntity from '@/interfaces/BaseEntity';

async function GetFormData(): Promise<{ roles: IBaseEntity[] }> {
  try {
    // Get all roles
    const roles: IBaseEntity[] = await Role.findAll({
      attributes: ['id', 'name']
    }).map(
      (role: Role): IBaseEntity => {
        return {
          id: role.id,
          name: role.name
        };
      }
    );

    return { roles };
  } catch (err) {
    app.logger.error('An error has occured when trying to get user form data', err);
  }
}
export default GetFormData;
