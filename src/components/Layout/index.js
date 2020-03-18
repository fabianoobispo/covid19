/* eslint-disable no-unused-expressions */
/* eslint-disable no-empty-pattern */
import React, { useContext, useEffect } from 'react';
import Switch from 'react-switch';
import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { ThemeContext } from 'styled-components';
import {
  IoLogoGithub,
  IoLogoLinkedin,
  IoIosMoon,
  IoIosSunny,
} from 'react-icons/io';
import useSWR from 'swr';

import api from '~/services/api';
import AppContext from '~/util/AppContext';
import useMobileWatcher from '~/util/useMobileWatcher';

import {
  Container,
  TopBar,
  Link,
  Numbers,
  Content,
  Header,
  Footer,
  FooterLine,
  LastUpdated,
} from './styles';

const fetcher = url => api.get(url);

const Layout = ({ children }) => {
  const isMobile = useMobileWatcher();
  const {
    location: { pathname },
  } = useHistory();

  const { colors } = useContext(ThemeContext);
  const { setCountriesData, toggleTheme, theme, setDailyData } = useContext(
    AppContext
  );

  const { data: generalData } = useSWR('/', fetcher, {
    suspense: true,
  });

  const { data: casesData } = useSWR('/confirmed', fetcher, {
    suspense: true,
    revalidateOnFocus: false,
  });

  const { data: dailyData } = useSWR('/daily', fetcher, {
    suspense: true,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (casesData?.data) {
      const formatedCountries = {
        biggestValue: 0,
        lowestValue: casesData.data[0].confirmed,
      };
      casesData?.data.forEach(el => {
        const conditionValue = formatedCountries[el.iso3];
        if (conditionValue) {
          const {
            confirmed,
            recovered,
            deaths,
            active,
            lastUpdate,
            ...rest
          } = conditionValue;
          const newValue = {
            ...rest,
            confirmed: confirmed + el.confirmed,
            deaths: deaths + el.deaths,
            active: active + el.active,
            lastUpdate: lastUpdate > el.lastUpdate ? lastUpdate : el.lastUpdate,
            recovered: recovered + el.recovered,
          };

          formatedCountries[el.iso3] = newValue;
        } else {
          formatedCountries[el.iso3] = el;
        }

        if (el.confirmed > formatedCountries.biggestValue) {
          formatedCountries.biggestValue = el.confirmed;
        }

        if (el.confirmed < formatedCountries.lowestValue) {
          formatedCountries.lowestValue = el.confirmed;
        }
      });
      setCountriesData(formatedCountries);
    }
  }, [casesData, setCountriesData]);

  useEffect(() => {
    if (dailyData?.data) {
      const confirmedData = [];
      const recoveredData = [];
      dailyData.data.forEach(el => {
        const formatedDate = format(new Date(el.reportDate), 'MM/dd/yyyy');
        confirmedData.push({
          x: formatedDate,
          y: el.totalConfirmed,
        });
        recoveredData.push({
          x: formatedDate,
          y: el.totalRecovered || 0,
        });
      });

      setDailyData([
        {
          id: 'Confirmed',
          color: colors.confirmed,
          data: confirmedData,
        },
        {
          id: 'Recovered',
          color: colors.recovered,
          data: recoveredData,
        },
      ]);
    }
  }, [dailyData, setDailyData, colors]);

  return (
    <Container>
      <Header>
        <TopBar>
          {isMobile ? (
            <div>
              <Link selected={pathname === '/'} to="/">
              Estatísticas mundiais
              </Link>
              <Link selected={pathname === '/daily'} to="/daily">
              Evolução diária
              </Link>
            </div>
          ) : (
            <div>
              <Link selected={pathname === '/'} to="/">
              Estatísticas mundiais
              </Link>
              <Link selected={pathname === '/daily'} to="/daily">
               Evolução diária
              </Link>
            </div>
          )}
          {isMobile ? (
            <div>
              <Switch
                checkedIcon={<IoIosMoon color="white" size={24} />}
                uncheckedIcon={<IoIosSunny color="white" size={24} />}
                className="switcher"
                onChange={toggleTheme}
                checked={theme?.title === 'dark'}
                onColor="#777777"
                offColor="#e8e8e8"
              />
            </div>
          ) : (
            <div>
              Light
              <Switch
                checkedIcon={false}
                uncheckedIcon={false}
                className="switcher"
                onChange={toggleTheme}
                checked={theme?.title === 'dark'}
                onColor="#777777"
                offColor="#e8e8e8"
              />
              Dark
            </div>
          )}
        </TopBar>
        <h1>COVID-19 Estatísticas Mundiais</h1>
        <Numbers>
          <div>
            <h3>{generalData?.data?.confirmed?.value || ''}</h3>
            <small>Confirmado</small>
          </div>
          <div>
            <h3>{generalData?.data?.recovered?.value || ''}</h3>
            <small>Suspeita</small>
          </div>
          <div>
            <h3>{generalData?.data?.deaths?.value || ''}</h3>
            <small>Mortes</small>
          </div>
        </Numbers>
      </Header>
      <Content>{children}</Content>
      <Footer>
        <LastUpdated>
          Ultimo update:{' '}
          {format(
            parseISO(generalData?.data?.lastUpdate || new Date()),
            'MM/dd/yyyy, HH:mm'
          )}
        </LastUpdated>
        <div>
         
          <FooterLine>
            <p>Fabiano Bispo</p>
            <div>
              <a
                href="https://www.linkedin.com/in/fabiano-bispo-422738109/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoLinkedin size={24} color={colors.primary} />
              </a>
              <a
                href="https://github.com/fabianoobispo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoGithub size={20} color={colors.primary} />
              </a>
            </div>
          </FooterLine>
        </div>
      </Footer>
    </Container>
  );
};

export default Layout;
