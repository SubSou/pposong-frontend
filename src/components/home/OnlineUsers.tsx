type OnlineUser = {
  userId: number;
  username: string;
  profileImageUrl: string | null;
};

type OnlineUsersProps = {
  users: OnlineUser[];
};

function OnlineUsers({ users }: OnlineUsersProps) {
  return (
    <aside className="hidden lg:block">
      <div className="rounded-2xl bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">실시간 접속자</h2>

          <span className="text-sm text-gray-400">{users.length}명</span>
        </div>

        {users.length === 0 ? (
          <p className="text-sm text-gray-400">현재 접속자가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.userId} className="flex items-center gap-3">
                <div className="relative">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                      <i className="bi bi-person-fill text-gray-500" />
                    </div>
                  )}

                  {/* 접속 중 표시 */}
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                </div>

                <span className="truncate text-sm font-medium text-gray-800">
                  {user.username}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

export default OnlineUsers;
