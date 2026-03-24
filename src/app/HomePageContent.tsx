"use client";

import NextLink from 'next/link';
import {
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Stack,
  ThemeProvider,
  createTheme
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type HomePageContentProps = {
  files: {
    filename: string;
    date: string;
    slug: string;
    title: string;
  }[];
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // matches tailwind blue-600
    },
    background: {
      default: '#f9fafb', // gray-50
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'inherit', // inherits from layout's body
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e5e7eb', // gray-200
        }
      }
    }
  }
});

export default function HomePageContent({ files }: HomePageContentProps) {
  if (files.length === 0) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ py: 12, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            暂无内容
          </Typography>
          <Typography variant="body2" color="text.disabled">
            请在 content 目录下添加 .md 文件
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight="bold" 
          sx={{ mb: 4, color: '#111827', display: 'flex', alignItems: 'center', gap: 1.5 }}
        >
          <ArticleIcon fontSize="large" color="primary" />
          最新摘要
        </Typography>

        <Stack spacing={3}>
          {files.map(({ filename, date, slug, title }) => (
            <Card
              key={filename}
              elevation={0}
              sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <CardActionArea component={NextLink} href={`/digest/${slug}`} sx={{ p: 3 }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                        <CalendarTodayIcon sx={{ fontSize: 16, mr: 1 }} />
                        <Typography variant="body2" fontWeight="medium">
                          {date}
                        </Typography>
                      </Box>
                      <Typography variant="h6" component="h2" fontWeight="600" color="#111827">
                        {title}
                      </Typography>
                    </Box>
                    <ArrowForwardIosIcon color="disabled" sx={{ fontSize: 20 }} />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
