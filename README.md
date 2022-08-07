# TRIPI.VN Project Structure - Rule & Coding conventions (ReactJS)

## - Project Structure - Cấu trúc Project

- Cấu trúc tổng quan 1 Project

![enter image description here](https://www.upsieutoc.com/images/2020/05/11/Screen-Shot-2020-05-11-at-17.26.30.png)

- Thư mục **config**: Chứa các config mặc định dùng chung trong project như API Url, Routers, config theme...
  ![enter image description here](https://www.upsieutoc.com/images/2020/05/11/Screen-Shot-2020-05-11-at-17.29.13.png)
- Thư mục **layout**: Chứa các page, component khung giao diện tổng quát cho project như Sidebar, Header, Conent, Footer, DefaultLayout, AuthenticationLayout, DashboardLayout...
  ![enter image description here](https://www.upsieutoc.com/images/2020/05/11/Screen-Shot-2020-05-11-at-17.32.36.png)
- Thư mục **modules**: Là thư mục tương tác chính trong dự án. Nơi chứa các modules mà dự án cần như authentication, userInfo, common,...
  ![enter image description here](https://www.upsieutoc.com/images/2020/05/11/Screen-Shot-2020-05-11-at-17.43.36.png)

  > Trong 1 module con thì gồm các thư mục **_common, components, pages, redux_**
  > Thư mục **_common_** module là nơi chứa các component được sử dụng chung, dùng lại nhiều lần.

- Thư mục **redux**: Đây là thư mục chứa cấu hình redux store tổng của dự án. Tất cả các reducer trong từng module nhỏ cần phải được khai báo tại đây.
  ![enter image description here](https://www.upsieutoc.com/images/2020/05/11/Screen-Shot-2020-05-11-at-17.33.41.png)
- Thư mục scss, svg: Nơi chứa các file css, svg của dự án.

##  Library - Các thư viện sử dụng thiết yếu

- [ ] react-dates
- [ ] react-intl
- [ ] react-loadable
- [ ] redux
- [ ] react-redux
- [ ] redux-thunk
- [ ] redux-persist
- [ ] styled-components
- [ ] Formik + yup

##  Rules & conventions

- [ ] ESLints _(AirBnb Config)_
- [ ] prettier

## Extensions for VSCode

   [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer)

   [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

   [ES7 React/Redux/GraphQL/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

   [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

   [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

   [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

   [Typescript React code snippets](https://marketplace.visualstudio.com/items?itemName=infeng.vscode-react-typescript)

## Start project

   `npm install`

   `npm start`

## Build project production

   `npm run build`

## Deploy project

   Step 1: Đăng nhập website Jenkins: https://web-jenkins.tripi.vn/

   Step 2: Tạo 1 New Item theo domain mà dùng để truy cập vào Website sau đó.

   Step 3: Chọn Copy from từ 1 project có sẵn bất kỳ để lấy cấu hình mẫu

   Step 4: Tại mục git url điền url git repository và branch ứng với project muốn build và chọn authentication là tài khoản của mình.

   Step 5: Chọn Apply để lưu lại.

   Step 6: Ra ngoài trang home của Jenkins chọn project vừa tạo và chọn Build Now để build project.

   Step 7: Trỏ subdomain về IP server web jenkins.

## Cấu hình Auto-deploy cho jenkins khi có câu lệnh Push vào project

   Step 1: Truy cập vào git repository và chọn Repository Setting.

   Step 2: Chọn **Webhook** ở menu bên phải và chọn **Add Webhook**

   Step 3: Tại màn hình tạo **webhook** click `Active State`, `Skip certificate verification`, `Repository push` và điền url sau vào ô URL: `https://web-jenkins.tripi.vn/bitbucket-hook/`

   Step 4: **Save**
