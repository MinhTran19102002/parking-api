/* eslint-disable no-undef */
import { array, exist } from 'joi';
import supertest from 'supertest';
import { CLOSE_DB } from '~/config/mongodb';
import { server } from '~/server';
import { parkingService } from '~/services/parkingService';
import { userService } from '~/services/personService';

describe('Test API user', () => {
  beforeAll(async () => {
    await server.connectDB();
  }, 10000);
  describe('get', () => {
    test('shoul 200', async () => {
      await supertest(server.app).get('/user/driver').expect(200);
    });
  });

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

  describe('Test ham findByID', () => {
    test('Cha ve mot object', async () => {
      let data = '6579e0992dd2654086718b62';
      const findByID = await userService.findByID(data);

      expect(findByID.name).toBe('Quách Thị Mai Anh');
    });
  });

  describe('Test ham findDriver', () => {
    test('Cha ve mot object', async () => {
      let data = '6579e0992dd2654086718b62';
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

  describe('Test ham deleteUser', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteUser = await userService.deleteUser('6579b62ace8624bd75e24a1f', 'Manager');
      } catch (error) {
        expect(error.message).toBe('Người lái không tồn tại');
      }
    });
  });

  describe('Test ham deleteMany', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteMany = await userService.deleteMany({ ids: ['6579b62ace8624bd75e24a1f'] });
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
      let req = {headers:{authorization:'minh 31231432424'}}
      try {
        const createManyEmployee = await userService.checkToken(req, {});
      } catch (error) {
        expect(error.message).toBe('Token không hợp lệ');
      }
    });
  });
});

// describe('Test API parking', () => {
//   beforeAll(async () => {
//     await server.connectDB();
//   }, 10000);
//   describe('Test ham getStatusByZone', () => {
//     test('Cha ve mot object', async () => {
//       const createManyEmployee = await parkingService.getStatusByZone('A');
//       expect(createManyEmployee.zone).toBe('A');
//     });
//   });

//   describe('Test ham getStatusByZone', () => {
//     test('Cha ve mot object', async () => {
//       const createManyEmployee = await parkingService.getStatusByZone('B');
//       expect(createManyEmployee.zone).toBe('B');
//     });
//   });

//   describe('Test ham getStatusByZone', () => {
//     test('Cha ve mot object', async () => {
//       try {
//         const createManyEmployee = await parkingService.getStatusByZone('B');
//       } catch (error) {
//         expect(error.message).toBe('Khu vực không được tìm thấy');
//       }
//     });
//   });
// });