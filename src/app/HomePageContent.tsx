"use client";

import NextLink from 'next/link';
import {
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Stack
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

export default function HomePageContent({ files }: HomePageContentProps) {
  if (files.length === 0) {
    return (
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          暂无内容
        </Typography>
        <Typography variant="body2" color="text.disabled">
          请在 content 目录下添加 .md 文件
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        fontWeight="bold" 
        sx={{ mb: 4, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1.5 }}
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
                boxShadow: (theme) => theme.palette.mode === 'light' 
                  ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' 
                  : '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5)',
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
                    <Typography variant="h6" component="h2" fontWeight="600" color="text.primary">
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
  );
}
