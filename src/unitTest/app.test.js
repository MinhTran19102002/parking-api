/* eslint-disable no-undef */
import { array, exist } from 'joi';
import supertest from 'supertest';
import { CLOSE_DB } from '~/config/mongodb';
import { server } from '~/server';
import { parkingService } from '~/services/parkingService';
import { parkingTurnService } from '~/services/parkingTurnService';
import { userService } from '~/services/personService';
import { vehicleService } from '~/services/vehicleService';

describe('Test API user', () => {
  beforeAll(async () => {
    await server.connectDB();
  }, 30000);
  // describe('get', () => {
  //   test('shoul 200', async () => {
  //     await supertest(server.app).get('/user/driver').expect(200);
  //   });
  // });

  describe('Test ham login', () => {
    test('Cha ve mot object', async () => {
      let req;
      const login = await userService.login(
        { body: { password: 'Parking@123', username: 'admin', role: 'Admin' } },
        req,
      );
      expect(login.person.account.username).toBe('admin');
    });
  });

  describe('Test ham login', () => {
    test('Cha ve mot object', async () => {
      let req;
      try {
        const login = await userService.login(
          { body: { password: 'Parking@123', username: 'admin', role: 'dmin' } },
          req,
        );
        expect(login.person.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham login', () => {
    test('Cha ve mot object', async () => {
      let req;
      try {
        const login = await userService.login(
          { body: { password: 'Parking@121', username: 'admin', role: 'Admin' } },
          req,
        );
        expect(login.person.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Mật khẩu không chính xác');
      }
    });
  });

  describe('Test ham login', () => {
    test('Cha ve mot object', async () => {
      let req;
      try {
        const login = await userService.login(
          { body: { password: 'Parking@121413', username: 'admin', role: 'Admin' } },
          req,
        );
        expect(login.person.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Mật khẩu không chính xác');
      }
    });
  });

  describe('Test ham login', () => {
    test('Cha ve mot object', async () => {
      let req;
      try {
        const login = await userService.login(
          { body: { password: 'Parking@121342', username: 'admin', role: 'Admin' } },
          req,
        );
        expect(login.person.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Mật khẩu không chính xác');
      }
    });
  });

  describe('Test ham createUser', () => {
    test('Cha ve mot object', async () => {
      let data = {
        account: {
          username: 'MaiAnh',
          password: 'Admin@123',
          role: 'Manager',
        },
        name: 'Quách Thị Mai Anh',
        address: 'An Giang',
        phone: '0909749720',
        email: 'maianh332@gmail.com',
      };
      try {
        const createUser = await userService.createUser(data);
      } catch (error) {
        expect(error.message).toBe('ApiError: Người dùng đã tồn tại');
      }
    });
  });

  describe('Test ham createUser', () => {
    test('Cha ve mot object', async () => {
      let data = {
        account: {
          username: 'MaiAnh',
          password: 'Admin@123',
          role: 'Manager',
        },
        name: 'Quách Thị Mai Anh',
        address: 'An Giang',
        phone: '0909709720',
        email: 'maianh332@gmail.com',
      };
      try {
        const createUser = await userService.createUser(data);
      } catch (error) {
        expect(error.message).toBe('ApiError: Người dùng đã tồn tại');
      }
    });
  });

  describe('Test ham createUserM', () => {
    test('Cha ve mot object', async () => {
      let data = {
        account: {
          username: 'MaiAnh',
          password: 'Admin@123',
          role: 'Manager',
        },
        name: 'Quách Thị Mai Anh',
        address: 'An Giang',
        phone: '0909749720',
        email: 'maianh332@gmail.com',
      };
      try {
        const createUserM = await userService.createUserM(data);
      } catch (error) {
        expect(error.message).toBe('ApiError: Người dùng đã tồn tại');
      }
    });
  });
  describe('Test ham changePassword', () => {
    test('Cha ve mot object', async () => {
      let data = {
        body: {
          username: 'LinhNguyen',
          password: 'LinhNguyen@123',
          newPassword: 'LinhNguyen@123',
        },
      };
      try {
        const changePassword = await userService.changePassword(data);
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham changePassword', () => {
    test('Cha ve mot object', async () => {
      let data = {
        body: {
          username: 'admin',
          password: 'Parking@123',
          newPassword: 'Parking@123',
          role: 'Admin',
        },
      };
      try {
        const changePassword = await userService.changePassword(data);
        expect(changePassword.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham changePassword', () => {
    test('Cha ve mot object', async () => {
      let data = {
        body: {
          username: 'admin',
          password: 'Parking@123',
          newPassword: 'Parking@123',
          role: 'Admin',
        },
      };
      try {
        const changePassword = await userService.changePassword(data);
        expect(changePassword.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham changePassword', () => {
    test('Cha ve mot object', async () => {
      let data = {
        body: {
          username: 'admin',
          password: 'Parking@123',
          newPassword: 'Parking@123',
          role: 'Admin',
        },
      };
      try {
        const changePassword = await userService.changePassword(data);
        expect(changePassword.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham changePassword', () => {
    test('Cha ve mot object', async () => {
      let data = {
        body: {
          username: 'admin',
          password: 'Parking@123',
          newPassword: 'Parking@123',
          role: 'Admin',
        },
      };
      try {
        const changePassword = await userService.changePassword(data);
        expect(changePassword.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham changePassword', () => {
    test('Cha ve mot object', async () => {
      let data = {
        body: {
          username: 'admin',
          password: 'Parking@123',
          newPassword: 'Parking@123',
          role: 'Admin',
        },
      };
      try {
        const changePassword = await userService.changePassword(data);
        expect(changePassword.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham createManyDriver', () => {
    test('Cha ve mot object', async () => {
      let data = [
        {
          licenePlate: '12A-1134',
          name: 'Tri thieu NGuyf',
          address: 'Tay Ninh',
          phone: '0996319853',
          email: 'thiekfdai1ds@gmail.com',
          job: 'Giảng viên',
          department: 'Cơ khí',
        },
      ];
      try {
        const createManyDriver = await userService.createManyDriver(data);
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham createDriver', () => {
    test('Cha ve mot object', async () => {
      let data = {
        licenePlate: '12A-1134',
        name: 'Tri thieu NGuyf',
        address: 'Tay Ninh',
        phone: '0996319853',
        email: 'thiekfdai1ds@gmail.com',
        job: 'Giảng viên',
        department: 'Cơ khí',
      };
      try {
        const createDriver = await userService.createDriver(data);
      } catch (error) {
        expect(error.message).toBe('Error: Xe đã có chủ');
      }
    });
  });

  describe('Test ham createDriver', () => {
    test('Cha ve mot object', async () => {
      let data = {
        licenePlate: '12A-1134',
        name: 'Tri thieu NGuyf',
        address: 'Tay Ninh',
        phone: '0996319853',
        email: 'thiekfdai1ds@gmail.com',
        job: 'Giảng viên',
        department: 'Cơ khí',
      };
      try {
        const createDriver = await userService.createDriver(data);
      } catch (error) {
        expect(error.message).toBe('Error: Xe đã có chủ');
      }
    });
  });

  describe('Test ham createDriver', () => {
    test('Cha ve mot object', async () => {
      let data = {
        licenePlate: '12A-1134',
        name: 'Tri thieu NGuyf',
        address: 'Tay Ninh',
        phone: '0996319853',
        email: 'thiekfdai1ds@gmail.com',
        job: 'Giảng viên',
        department: 'Cơ khí',
      };
      try {
        const createDriver = await userService.createDriver(data);
      } catch (error) {
        expect(error.message).toBe('Error: Xe đã có chủ');
      }
    });
  });

  describe('Test ham createDriver', () => {
    test('Cha ve mot object', async () => {
      let data = {
        licenePlate: '12A-1134',
        name: 'Tri thieu NGuyf',
        address: 'Tay Ninh',
        phone: '0996319853',
        email: 'thiekfdai1ds@gmail.com',
        job: 'Giảng viên',
        department: 'Cơ khí',
      };
      try {
        const createDriver = await userService.createDriver(data);
      } catch (error) {
        expect(error.message).toBe('Error: Xe đã có chủ');
      }
    });
  });

  describe('Test ham createDriver', () => {
    test('Cha ve mot object', async () => {
      let data = {
        licenePlate: '12A-1134',
        name: 'Tri thieu NGuyf',
        address: 'Tay Ninh',
        phone: '0996319853',
        email: 'thiekfdai1ds@gmail.com',
        job: 'Giảng viên',
        department: 'Cơ khí',
      };
      try {
        const createDriver = await userService.createDriver(data);
      } catch (error) {
        expect(error.message).toBe('Error: Xe đã có chủ');
      }
    });
  });

  describe('Test ham createDriver', () => {
    test('Cha ve mot object', async () => {
      let data = {
        licenePlate: '12A-1134',
        name: 'Tri thieu NGuyf',
        address: 'Tay Ninh',
        phone: '0996319853',
        email: 'thiekfdai1ds@gmail.com',
        job: 'Giảng viên',
        department: 'Cơ khí',
      };
      try {
        const createDriver = await userService.createDriver(data);
      } catch (error) {
        expect(error.message).toBe('Error: Xe đã có chủ');
      }
    });
  });

  describe('Test ham findByID', () => {
    test('Cha ve mot object', async () => {
      let data = '6579e0992dd2654086718b62';
      const findByID = await userService.findByID(data);

      expect(findByID.name).toBe('Quách Thị Mai Anh');
    });
  });

  describe('Test ham findByID', () => {
    test('Cha ve mot object', async () => {
      let data = '6579e0992dd2654086718b62';
      const findByID = await userService.findByID(data);

      expect(findByID.name).toBe('Quách Thị Mai Anh');
    });
  });

  describe('Test ham findByID', () => {
    test('Cha ve mot object', async () => {
      let data = '6579e0992dd2654086718162';

      try {
        const findByID = await userService.findByID(data);
        expect(findByID.name).toBe('Quách Thị Mai Anh');
      } catch (error) {
        expect(error.message).toBe('Users not exist');
      }
    });
  });

  describe('Test ham findDriver', () => {
    test('Cha ve mot object', async () => {
      let data = '6579e0992dd2654086718b62';
      const findDriver = await userService.findDriver();

      expect(findDriver).toEqual(expect.any(Array));
    });
  });

  describe('Test ham findDriver', () => {
    test('Cha ve mot object', async () => {
      let data = '6579e0992dd2614086718b62';
      const findDriver = await userService.findDriver();

      expect(findDriver).toEqual(expect.any(Array));
    });
  });

  describe('Test ham findDriver', () => {
    test('Cha ve mot object', async () => {
      let data = '657900992dd2614086718b62';
      const findDriver = await userService.findDriver();

      expect(findDriver).toEqual(expect.any(Array));
    });
  });

  describe('Test ham findDriver', () => {
    test('Cha ve mot object', async () => {
      let data = '657900992dd2604086718b62';
      const findDriver = await userService.findDriver();

      expect(findDriver).toEqual(expect.any(Array));
    });
  });

  describe('Test ham findDriverByFilter', () => {
    test('Cha ve mot object', async () => {
      const findDriver = await userService.findDriverByFilter({});

      expect(findDriver.data).toEqual(expect.any(Array));
    });
  });

  describe('Test ham findDriverByFilter', () => {
    test('Cha ve mot object', async () => {
      const findDriver = await userService.findDriverByFilter({pageSize: 1, pageIndex : 1});

      expect(findDriver.data).toEqual(expect.any(Array));
    });
  });

  describe('Test ham findManagerByFilter', () => {
    test('Cha ve mot object', async () => {
      const findManagerByFilter = await userService.findManagerByFilter({});

      expect(findManagerByFilter.data).toEqual(expect.any(Array));
    });
  });

  describe('Test ham findUsers', () => {
    test('Cha ve mot object', async () => {
      const findManagerByFilter = await userService.findUsers({ role: 'Manager' });

      expect(findManagerByFilter.data).toEqual(expect.any(Array));
    });
  });
  describe('Test ham findUsers', () => {
    test('Cha ve mot object', async () => {
      const findManagerByFilter = await userService.findUsers({ role: 'Manager' });

      expect(findManagerByFilter.data).toEqual(expect.any(Array));
    });
  });
  describe('Test ham findUsers', () => {
    test('Cha ve mot object', async () => {
      const findManagerByFilter = await userService.findUsers({ role: 'Manager' });

      expect(findManagerByFilter.data).toEqual(expect.any(Array));
    });
  });
  describe('Test ham findUsers', () => {
    test('Cha ve mot object', async () => {
      const findManagerByFilter = await userService.findUsers({ role: 'Manager' });

      expect(findManagerByFilter.data).toEqual(expect.any(Array));
    });
  });

  describe('Test ham updateUser', () => {
    test('Cha ve mot object', async () => {
      let data = {
        name: 'Quách Thị Mai Anh',
        address: 'An Giang',
        phone: '0909749720',
        email: 'maianh332@gmail.com',
      };
      try {
        const updateUser = await userService.updateUser('6579b62ace8624bd75e24a1f', data);
      } catch (error) {
        expect(error.message).toBe('Người dùng cập nhật không thành công');
      }
    });
  });

  describe('Test ham updateDriver', () => {
    test('Cha ve mot object', async () => {
      let data = {
        name: 'Nguyễn Tuấn Công',
        phone: '0357654791',
        email: 'tuancongn13@gmail.com',
        address: 'Tay Ninh',
        licenePlate: '13A-2171',
        job: 'Teacher',
        department: 'Khoa Công nghệ thông tin',
      };
      try {
        const updateDriver = await userService.updateDriver('6579b62ace8624bd75e24a1f', data);
      } catch (error) {
        expect(error.message).toBe('Không tìm thấy người');
      }
    });
  });

  describe('Test ham deleteDriver', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteDriver = await userService.deleteDriver('6579b62ace8624bd75e24a1f');
      } catch (error) {
        expect(error.message).toBe('ApiError');
      }
    });
  });

  describe('Test ham deleteDrivers', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteDrivers = await userService.deleteDrivers(['6579b62ace8624bd75e24a1f']);
      } catch (error) {
        expect(error.message).toBe('Người lái không tồn tại');
      }
    });
  });

  describe('Test ham deleteDrivers', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteDrivers = await userService.deleteDrivers(['6579b62ace8624bd75e24a1f', '6579b62ace8624bd75e24a1f']);
      } catch (error) {
        expect(error.message).toBe('Người lái không tồn tại');
      }
    });
  });

  describe('Test ham deleteDrivers', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteDrivers = await userService.deleteDrivers(['6579b62ace8624bd75e24a1f', '6579b62ace8624bd75e24a1f', '6579b62ace8624bd75e24a1f']);
      } catch (error) {
        expect(error.message).toBe('Người lái không tồn tại');
      }
    });
  });

  describe('Test ham deleteUser', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteUser = await userService.deleteUser('6579b62ace8624bd75e24a1f', 'Manager');
      } catch (error) {
        expect(error.message).toBe('Người lái không tồn tại');
      }
    });
  });

  describe('Test ham deleteUser', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteUser = await userService.deleteUser('6579b62ac18624bd78e24a1f', 'Manager');
      } catch (error) {
        expect(error.message).toBe('Người lái không tồn tại');
      }
    });
  });

  describe('Test ham deleteMany', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteMany = await userService.deleteMany({ ids: ['6579b62ace8624bd75e24a1f', '6579b62ace86240175e24a1f'] });
      } catch (error) {
        expect(error.message).toBe('Người lái không tồn tại');
      }
    });
  });
  describe('Test ham findEmployees', () => {
    test('Cha ve mot object', async () => {
      const findEmployees = await userService.findEmployees({});
      expect(findEmployees.data).toEqual(expect.any(Array));
    });
  });

  describe('Test ham createEmployee', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteMany = await userService.createEmployee({
          name: 'Quách Thị Mai Anh',
          address: 'An Giang',
          phone: '0909749720',
          email: 'maianh332@gmail.com',
        });
      } catch (error) {
        expect(error).toEqual(expect.any(Error));
      }
    });
  });

  describe('Test ham createEmployee', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteMany = await userService.createEmployee({
          name: 'Quách Thị Mai Anh',
          address: 'An Giang',
          phone: '0909749720',
          email: 'maianh332@gmail.com',
        });
      } catch (error) {
        expect(error).toEqual(expect.any(Error));
      }
    });
  });

  describe('Test ham createEmployee', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteMany = await userService.createEmployee({
          name: 'Quách Thị Mai Anh',
          address: 'An Giang',
          phone: '0909749720',
          email: 'maianh332@gmail.com',
        });
      } catch (error) {
        expect(error).toEqual(expect.any(Error));
      }
    });
  });

  describe('Test ham updateEmployee', () => {
    test('Cha ve mot object', async () => {
      let data = {
        name: 'Quách Thị Mai Anh',
        address: 'An Giang',
        phone: '0909749720',
        email: 'maianh332@gmail.com',
      };
      try {
        const updateEmployee = await userService.updateEmployee('6579b62ace8624bd75e24a1f', data);
      } catch (error) {
        expect(error.message).toBe('Cập nhật nhân viên không thành công');
      }
    });
  });

  describe('Test ham createManyEmployee', () => {
    test('Cha ve mot object', async () => {
      let data = [
        {
          name: 'Tri thieu NGuyf',
          address: 'Tay Ninh',
          phone: '0996319853',
          email: 'thiekfdai1ds@gmail.com',
        },
      ];
      try {
        const createManyEmployee = await userService.createManyEmployee(data);
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham checkToken', () => {
    test('Cha ve mot object', async () => {
      let req = { headers: { authorization: 'minh 31231432424' } };
      try {
        const createManyEmployee = await userService.checkToken(req, {});
      } catch (error) {
        expect(error.message).toBe('Token không hợp lệ');
      }
    });
  });

  describe('Test ham checkToken', () => {
    test('Cha ve mot object', async () => {
      let req = { headers: { authorization: 'minh 31231432424' } };
      try {
        const createManyEmployee = await userService.checkToken(req, {});
      } catch (error) {
        expect(error.message).toBe('Token không hợp lệ');
      }
    });
  });

  describe('Test ham checkToken', () => {
    test('Cha ve mot object', async () => {
      let req = { headers: { authorization: 'Bear 31231432424' } };
      try {
        const createManyEmployee = await userService.checkToken(req, {});
      } catch (error) {
        expect(error.message).toBe('Token không hợp lệ');
      }
    });
  });
});

describe('Test API parking', () => {
  describe('Test ham getStatusByZone', () => {
    test('Cha ve mot object', async () => {
      const createManyEmployee = await parkingService.getStatusByZone('A');
      expect(createManyEmployee.zone).toBe('A');
    });
  });

  describe('Test ham getStatusByZone', () => {
    test('Cha ve mot object', async () => {
      const createManyEmployee = await parkingService.getStatusByZone('B');
      expect(createManyEmployee.zone).toBe('B');
    });
  });

  describe('Test ham getStatusByZone', () => {
    test('Cha ve mot object', async () => {
      const createManyEmployee = await parkingService.getStatusByZone('C');
      expect(createManyEmployee.zone).toBe('C');
    });
  });

  describe('Test ham getStatusByZone', () => {
    test('Cha ve mot object', async () => {
      try {
        const createManyEmployee = await parkingService.getStatusByZone('D');
      } catch (error) {
        expect(error.message).toBe('Khu vực không được tìm thấy');
      }
    });
  });

  describe('Test ham getStatusByZone', () => {
    test('Cha ve mot object', async () => {
      try {
        const createManyEmployee = await parkingService.getStatusByZone('B');
      } catch (error) {
        expect(error.message).toBe('Khu vực không được tìm thấy');
      }
    });
  });

  describe('Test ham createPaking', () => {
    test('Cha ve mot object', async () => {
      let data = { zone: 'C', description: '1eqweq', slots: [{ position: 'aewqe' }] };
      try {
        const createPaking = await parkingService.createPaking(data);
      } catch (error) {
        expect(error.message).toBe('ApiError: Khu vực không được tìm thấy');
      }
    });
  });

  describe('Test ham createPaking', () => {
    test('Cha ve mot object', async () => {
      let data = { zone: 'B', description: '1eqweq', slots: [{ position: 'aewqe' }] };
      try {
        const createPaking = await parkingService.createPaking(data);
      } catch (error) {
        expect(error.message).toBe('ApiError: Khu vực không được tìm thấy');
      }
    });
  });

  describe('Test ham getStatus', () => {
    test('Cha ve mot object', async () => {
      const getStatus = await parkingService.getStatus('A');
      expect(getStatus).toEqual(expect.any(Array));
    });
  });

  describe('Test ham getStatus', () => {
    test('Cha ve mot object', async () => {
      const getStatus = await parkingService.getStatus('B');
      expect(getStatus).toEqual(expect.any(Array));
    });
  });

  describe('Test ham getStatus', () => {
    test('Cha ve mot object', async () => {
      const getStatus = await parkingService.getStatus('C');
      expect(getStatus).toEqual(expect.any(Array));
    });
  });

  describe('Test ham getStatus', () => {
    test('Cha ve mot object', async () => {
      try {
        const getStatus = await parkingService.getStatus('D');
      } catch (error) {
        expect(error.message).toBe('Khu vực không được tìm thấy');
      }
    });
  });
});

describe('Test API ParkingTune', () => {
  describe('Test ham createPakingTurn', () => {
    test('Cha ve mot object', async () => {
      try {
        const createPakingTurn = await parkingTurnService.createPakingTurn('12A-3231', 'A', 'A105');
        expect(createPakingTurn.acknowledged).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Vị trí đã có xe');
      }
    });
  });

  // describe('Test ham outPaking', () => {
  //   test('Cha ve mot object', async () => {
  //     try {
  //       const createPakingTurn = await parkingTurnService.outPaking('12A-3231');
  //       expect(createPakingTurn.acknowledged).toBe(true);
  //     } catch (error) {
  //       expect(error.message).toBe('ApiError: Xe không ở trong bãi');
  //     }
  //   });
  // });

  describe('Test ham getRevenue', () => {
    test('Cha ve mot object', async () => {
      try {
        const getRevenue = await parkingTurnService.getRevenue({ query: {} }, {});
        expect(getRevenue).toEqual(expect.any(Array));
      } catch (error) {
        expect(error.message).toBe('ApiError: Xe không ở trong bãi');
      }
    });
  });

  describe('Test ham getEvent', () => {
    test('Cha ve mot object', async () => {
      try {
        const getEvent = await parkingTurnService.getEvent({ query: {} }, {});
        expect(getEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('ApiError: Xe không ở trong bãi');
      }
    });
  });

  describe('Test ham exportEvent', () => {
    test('Cha ve mot object', async () => {
      try {
        const exportEvent = await parkingTurnService.exportEvent({ query: {} }, {});
        expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('500');
      }
    });
  });
});

describe('Test API vehicle', () => {
  describe('Test ham createVehicle', () => {
    test('Cha ve mot object', async () => {
      try {
        const createVehicle = await vehicleService.createVehicle('12A-3231', 'Car');
        //expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Error: Vehicle already exists');
      }
    });
  });

  describe('Test ham createVehicle', () => {
    test('Cha ve mot object', async () => {
      try {
        const createVehicle = await vehicleService.createVehicle('12A-3231', 'Car');
        //expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Error: Vehicle already exists');
      }
    });
  });

  describe('Test ham createVehicle', () => {
    test('Cha ve mot object', async () => {
      try {
        const createVehicle = await vehicleService.createVehicle('12A-2171', 'Car');
        //expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Error: Vehicle already exists');
      }
    });
  });

  describe('Test ham createVehicle', () => {
    test('Cha ve mot object', async () => {
      try {
        const createVehicle = await vehicleService.createVehicle('12A-3214', 'Car');
        //expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Error: Vehicle already exists');
      }
    });
  });
});
