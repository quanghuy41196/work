// Dev-only mock data. Email is read from env so it never needs to be hardcoded.
export const signInUserData =
    process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ACCOUNT_DEFAULT
        ? [
              {
                  id: '21',
                  avatar: '',
                  userName: 'Dev Admin',
                  email: process.env.NEXT_PUBLIC_ACCOUNT_DEFAULT,
                  authority: ['admin', 'user'],
                  accountUserName: 'admin',
              },
          ]
        : []
