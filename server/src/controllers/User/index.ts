import Login from './authentication/login';
import ResetPassword from './authentication/resetPassword';
import Settings from './crud/settings';
import GetFormData from './crud/getFormData';
import LoginHistory from './crud/loginHistory';
import List from './crud/list';
import UpdateMeta from './updateMeta';
import UpdateState from './updateState';
import Create from './crud/create';
import Update from './crud/update';
import Delete from './crud/delete';

export default class UserController {
  // Authentication
  public static Login = Login;
  public static ResetPassword = ResetPassword;

  // Crud
  public static Create = Create;
  public static Update = Update;
  public static Delete = Delete;
  public static Settings = Settings;
  public static List = List;
  public static GetFormData = GetFormData;
  public static LoginHistory = LoginHistory;

  public static UpdateState = UpdateState;
  public static UpdateMeta = UpdateMeta;
}
