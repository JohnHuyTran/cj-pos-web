// componets/Greetings.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { idText } from 'typescript';
import DCCheckOrderSearch from '../../../components/dc-check-orders/dc-check-order';
import App from '../../../App';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// let wrapper:any = render(<UnitTestComponent name="Test Name" />);
let wrapper;
beforeEach(() => {
  // wrapper = render(<UnitTestComponent name="Test Name" />);
  wrapper = render(<DCCheckOrderSearch />);
});

describe('when rendered with a `name` prop', () => {
  const initialState = {
    navigator: {
      state: true,
    },
    auth: {
      token:
        'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJqR0hhYkFyYjFENXlnaG11Tl84YkxBTjlnOGZLZlZSUnZzZVlPbDhTR1lJIn0.eyJleHAiOjE2NTA0MjI1NTAsImlhdCI6MTY1MDQyMDc1MCwianRpIjoiNWVmOTIyYjAtMWYxZi00M2E1LWIxOGMtMzQxMmFiN2YzY2I0IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLWRldi5jamV4cHJlc3MuaW8vYXV0aC9yZWFsbXMvY2pleHByZXNzIiwiYXVkIjpbInNlcnZpY2UucG9zYmFjay1wdXJjaGFzZSIsInNlcnZpY2UucG9zYmFjay1wcm9kdWN0Iiwic2VydmljZS5wb3NiYWNrLXN0b2NrIiwic2VydmljZS5wb3NiYWNrLW9yZGVyIiwic2VydmljZS5wb3NiYWNrLXNhbGUiLCJzZXJ2aWNlLnBvc2JhY2stc2FwLWNvbm5lY3RvciIsInNlcnZpY2UucG9zYmFjay10YXNrIiwic2VydmljZS5wb3NiYWNrLXN1cHBsaWVyIiwic2VydmljZS5wb3NiYWNrLXNjaGVkdWxlciIsInNlcnZpY2UucG9zYmFjay1jYW1wYWlnbiIsInNlcnZpY2UucG9zYmFjay1tYXN0ZXIiLCJzZXJ2aWNlLnBvc2JhY2stYXV0aG9yaXR5Iiwic2VydmljZS5wb3NiYWNrLWhhbmRoZWxkLWFkYXB0ZXIiXSwic3ViIjoiNDMwNWZjMjgtY2Y1NC00MzIwLWI4NzAtNDFjOWIxYWY5MmNiIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoid2ViLnBvc2JhY2staHEiLCJzZXNzaW9uX3N0YXRlIjoiNDA1MWNhYzYtY2NhNy00MGJjLTg4NzUtYmJmMWYwYjM5ZGUzIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwIl0sInNjb3BlIjoic2NvcGUucG9zYmFjay1zYXAtY29ubmVjdG9yIHNjb3BlLnBvc2JhY2stdGFzayBzY29wZS5wb3NiYWNrLWNhbXBhaWduIHNjb3BlLnBvc2JhY2staGFuZGhlbGQtYWRhcHRlciBzY29wZS5wb3NiYWNrLXN1cHBsaWVyIHNjb3BlLnBvc2JhY2stb3JkZXIgcHJvZmlsZSBzY29wZS5wb3NiYWNrLXN0b2NrIHNjb3BlLnBvc2JhY2stc2FsZSBzY29wZS5wb3NiYWNrLXNjaGVkdWxlciBzY29wZS5wb3NiYWNrLXByb2R1Y3Qgc2NvcGUucG9zYmFjay1wdXJjaGFzZSBlbWFpbCBzY29wZS5wb3NiYWNrLW1hc3RlciBzY29wZS5wb3NiYWNrLWF1dGhvcml0eSBzY29wZS5wb3NiYWNrLWJyYW5jaGluZm8iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJwb3NkYzAxIiwiZ3JvdXBzIjpbIi9zZXJ2aWNlLnBvc2JhY2svZGMwMSJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwb3NkYzAxIiwiYWNsIjp7InNlcnZpY2UucG9zYmFjay1zdG9jayI6WyJzdG9jay5idC53YWl0X2RjIiwic3RvY2suYnQuZXhwb3J0Iiwic3RvY2suYnQudmlldyIsInN0b2NrLm1hc3RlciJdLCJzZXJ2aWNlLnBvc2JhY2stYXV0aG9yaXR5IjpbImF1dGhvcml0eS5jaGVjayJdLCJzZXJ2aWNlLnBvc2JhY2stb3JkZXIiOlsib3JkZXIuYm8udmlldyIsIm9yZGVyLnZlci5tYW5hZ2UiLCJvcmRlci52ZXIudmlldyJdLCJzZXJ2aWNlLnBvc2JhY2stbWFzdGVyIjpbIm1hc3Rlci5maWxlLmRvd25sb2FkIiwibWFzdGVyLnNlYXJjaCJdLCJzZXJ2aWNlLnBvc2JhY2stdGFzayI6WyJ0YXNrLnZpZXciXX0sImdpdmVuX25hbWUiOiJwb3NkYzAxIiwiYnJhbmNoIjoiMDEwMSJ9.Qy3tJE7qq4Q1KVFvh-hwTF_Cw1t-psvL2t9roNBmLxSYZhJ2tsdrhgDbNL74li7pr77ZuDIUREHWbdUe9ilSBB-VJd4jRfXcbCxEL_K2m115A9z6m4ec7K46OsDZ2c586Ek9Zmsa5qeiRNVWS-bvUJDG3wcIaLuSgJwpRsml6j69GzkM-1zkVobxNPiI1cWndi0Af890kuoQtDkn6E0P8uL1BAM5SHTGjLMHLs-JY22SnUt-dA0yk6-feV-R82RHPvvQsBiAxM_ca7Pn6AhNa32TdweLufoRdmyqhuD9-I1zU4fcon9nS95IVQet6esjlb94hV191q3ZyU25zhh5eA',
      isLogin: false,
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJkMzJlYzA5Yi0xNzNjLTQ2NWUtYjgxYy00ODkzMWI5MTI0MjIifQ.eyJleHAiOjE2NTA1MDcxNTAsImlhdCI6MTY1MDQyMDc1MCwianRpIjoiYjgyYWM4MDctNjE0OS00ZTBiLWI5Y2EtNmQyZWE2NDBlNTg3IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLWRldi5jamV4cHJlc3MuaW8vYXV0aC9yZWFsbXMvY2pleHByZXNzIiwiYXVkIjoiaHR0cHM6Ly9hdXRoLWRldi5jamV4cHJlc3MuaW8vYXV0aC9yZWFsbXMvY2pleHByZXNzIiwic3ViIjoiNDMwNWZjMjgtY2Y1NC00MzIwLWI4NzAtNDFjOWIxYWY5MmNiIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6IndlYi5wb3NiYWNrLWhxIiwic2Vzc2lvbl9zdGF0ZSI6IjQwNTFjYWM2LWNjYTctNDBiYy04ODc1LWJiZjFmMGIzOWRlMyIsInNjb3BlIjoic2NvcGUucG9zYmFjay1zYXAtY29ubmVjdG9yIHNjb3BlLnBvc2JhY2stdGFzayBzY29wZS5wb3NiYWNrLWNhbXBhaWduIHNjb3BlLnBvc2JhY2staGFuZGhlbGQtYWRhcHRlciBzY29wZS5wb3NiYWNrLXN1cHBsaWVyIHNjb3BlLnBvc2JhY2stb3JkZXIgcHJvZmlsZSBzY29wZS5wb3NiYWNrLXN0b2NrIHNjb3BlLnBvc2JhY2stc2FsZSBzY29wZS5wb3NiYWNrLXNjaGVkdWxlciBzY29wZS5wb3NiYWNrLXByb2R1Y3Qgc2NvcGUucG9zYmFjay1wdXJjaGFzZSBlbWFpbCBzY29wZS5wb3NiYWNrLW1hc3RlciBzY29wZS5wb3NiYWNrLWF1dGhvcml0eSBzY29wZS5wb3NiYWNrLWJyYW5jaGluZm8ifQ.-lcAfESUdIaHriU-IqiWxjf0GhLeyroyjtjpOXTAPaY',
      sessionState: '4051cac6-cca7-40bc-8875-bbf1f0b39de3',
      error: '',
    },
  };
  const mockStore = configureStore();
  let store;
  it('should paste it into the greetings text', () => {
    store = mockStore(initialState);
    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText(/ค้นหาเอกสาร/)).toBeInTheDocument();
  });

  //   it('should render the sending waves button', () => {
  //     expect(screen.getByRole('button')).toBeInTheDocument();
  //   });

  //   it('should call the `testXX` callback', () => {
  //     userEvent.click(screen.getByRole('button'));
  //     expect(screen.getByText(/success/)).toBeInTheDocument();
  //   });
});
