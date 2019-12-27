import Create from './crud/create';
import Update from './crud/update';
import Delete from './crud/delete';
import Settings from './crud/settings';
import List from './crud/list';
import UpdateMeta from './updateMeta';
import GetSelectedUsers from './crud/GetSelectedUsers';
import AllowUsers from './crud/allowUsers';
import Workspace from './workspace';

export default class NoteController {
  // Crud
  public static Create = Create;
  public static Update = Update;
  public static Delete = Delete;
  public static Settings = Settings;
  public static List = List;
  public static UpdateMeta = UpdateMeta;
  public static GetSelectedUsers = GetSelectedUsers;
  public static AllowUsers = AllowUsers;

  public static Workspace = Workspace;
}
