import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import UserService from "../../../services/UserService";
import { Spinner } from "../../../components/Spinner/Spinner";
import type { UserColumns } from "../../../Interfaces/UserInterface";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";

interface UserlistProps {
  onAddUser: () => void;
  onEditUser: (user: UserColumns | null) => void;
  onDeleteUser: (user: UserColumns | null) => void;
  refreshKey: boolean;
}

const UserList: FC<UserlistProps> = ({
  onAddUser,
  onEditUser,
  onDeleteUser,
  refreshKey,
}) => {
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<UserColumns[]>([]);
  const [usersTableCurrentPage, setUsersTableCurrentPage] = useState(1);
  const [usersTableLastPage, setUsersTableLastPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const tableRef = useRef<HTMLDivElement>(null);

  const handleLoadUsers = async (
    page: number,
    append = false,
    search: string,
  ) => {
    try {
      setLoadingUsers(true);

      const res = await UserService.loadusers(page, search);

      if (res.status === 200) {
        const usersData = res.data.users.data || res.data.users || [];
        const lastPage =
          res.data.users.last_page ||
          res.data.last_page ||
          usersTableLastPage ||
          1;

        setUsers(append ? [...users, ...usersData] : usersData);
        setUsersTableCurrentPage(page);
        setUsersTableLastPage(lastPage);
        setHasMore(page < lastPage);
      } else {
        setUsers(append ? users : []);
        setHasMore(false);
      }
    } catch (error) {
      console.error(
        "Unexpected status error occured during loading users: ",
        error,
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleScroll = useCallback(() => {
    const ref = tableRef.current;

    if (
      ref &&
      ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 10 &&
      hasMore &&
      !loadingUsers
    ) {
      handleLoadUsers(usersTableCurrentPage + 1, true, debouncedSearch);
    }
  }, [hasMore, loadingUsers, usersTableCurrentPage]);

  const handleUserFullNameFormat = (user: UserColumns) => {
    let fullName = "";

    if (user.middle_name) {
      fullName = `${user.last_name}, ${user.first_name} ${user.middle_name.charAt(0)}.`;
    } else {
      fullName = `${user.last_name}, ${user.first_name}`;
    }

    if (user.suffix_name) {
      fullName += ` ${user.suffix_name}`;
    }
    return fullName;
  };

  useEffect(() => {
    const ref = tableRef.current;

    if (ref) {
      ref.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (ref) {
        ref.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setUsers([]);
    setUsersTableCurrentPage(1);
    setHasMore(true);

    handleLoadUsers(1, false, debouncedSearch);
  }, [refreshKey, debouncedSearch]);
  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div
          ref={tableRef}
          className="relative max-w-full max-h-[calc(100vh-3.5rem)] overflow-x-auto"
        >
          <Table>
            <caption className="mb-4 text-left">
              <div className="border-b border-gray-100">
                <div className="p-4 flex justify-between">
                  <div className="w-64 text-left">
                    <FloatingLabelInput
                      label="Search"
                      type="text"
                      name="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition cursor-pointer"
                    onClick={onAddUser}
                  >
                    Add User
                  </button>
                </div>
              </div>
            </caption>
            <TableHeader className="border-b border-gray-200 bg-blue-600 sticky top-0 text-white text-xs">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  Full Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  Gender
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  Birth Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  Age
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
              {(users.length ?? 0 > 0) ? (
                users.map((user, index) => (
                  <TableRow className="hover:bg-gray-100" key={index}>
                    <TableCell className="px-4 py-3 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      {handleUserFullNameFormat(user)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      {user.gender.gender}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      {user.birth_date}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      {user.age}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex gap-4 justify-center">
                        <button
                          type="button"
                          className="text-green-600 font-medium cursor-pointer hover:underline"
                          onClick={() => onEditUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-600 font-medium cursor-pointer hover:underline"
                          onClick={() => onDeleteUser(user)}
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : !loadingUsers && (users.length ?? 0) <= 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-4 py-3 text-center font-medium"
                  >
                    No Records Found
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="px-4 py-3 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              )}
              ;
              {loadingUsers && (users.length ?? 0) > 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="px-4 py-3 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              )}
              ;
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default UserList;
