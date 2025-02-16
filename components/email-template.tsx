import { Html } from '@react-email/html';
import { Text } from '@react-email/text';
import { Section } from '@react-email/section';
import { Container } from '@react-email/container';
import { parseNewsletterText } from '@/lib/newsletter-utils';
import { format } from 'date-fns';

interface EmailTemplateProps {
  content: string;
}

export const EmailTemplate = ({
  content,
}: EmailTemplateProps) => {
  const newsData = parseNewsletterText(content);

  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Text style={heading}>Your Axon AI Newsletter</Text>
          
          {newsData.map((section, sectionIndex) => (
            <div key={sectionIndex} style={section_style}>
              <Text style={section_heading}>{section.category}</Text>
              
              {section.articles.map((article, articleIndex) => (
                <div key={articleIndex} style={article_style}>
                  {/* Article Title */}
                  <Text style={article_title}>{article.title}</Text>
                  
                  {/* Article Metadata */}
                  <div style={metadata_style}>
                    {/* Date */}
                    {article.timestamp && (
                      <div style={date_container}>
                        <span style={date_style}>
                          {format(new Date(article.timestamp), 'MMMM d, yyyy')}
                        </span>
                      </div>
                    )}
                    
                    {/* Priority and Tags */}
                    <div style={tags_container}>
                      {article.priority && (
                        <span style={getPriorityStyle(article.priority)}>
                          {getPriorityLabel(article.priority)}
                        </span>
                      )}
                      {article.tags && article.tags.length > 0 && (
                        article.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} style={tag_style}>{tag}</span>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* Article Content */}
                  <div 
                    style={content_style}
                    dangerouslySetInnerHTML={{ 
                      __html: article.content.replace(
                        /\*\*(.*?)\*\*/g, 
                        '<span style="color: #484848; font-weight: 600;">$1</span>'
                      )
                    }} 
                  />
                </div>
              ))}
            </div>
          ))}

          <Text style={paragraph}>
            Best regards,<br />
            The Axon Team
          </Text>
        </Container>
      </Section>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
  marginBottom: '32px',
};

const section_style = {
  marginBottom: '40px',
};

const section_heading = {
  fontSize: '24px',
  lineHeight: '1.4',
  fontWeight: '600',
  color: '#484848',
  marginBottom: '24px',
};

const article_style = {
  marginBottom: '32px',
  padding: '24px',
  backgroundColor: '#f8f9fa',
  borderRadius: '12px',
  border: '1px solid #e9ecef',
};

const article_title = {
  fontSize: '20px',
  lineHeight: '1.4',
  fontWeight: '600',
  color: '#484848',
  marginBottom: '16px',
};

const metadata_style = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px',
  marginBottom: '16px',
};

const date_container = {
  marginBottom: '4px',
};

const date_style = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#4b5563',
};

const content_style = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#484848',
};

const tags_container = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '12px',
};

const tag_style = {
  fontSize: '12px',
  padding: '6px 12px',
  backgroundColor: '#e9ecef',
  borderRadius: '6px',
  color: '#6c757d',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#484848',
  marginTop: '32px',
};

function getPriorityStyle(priority: number) {
  const baseStyle = {
    fontSize: '12px',
    padding: '6px 12px',
    borderRadius: '6px',
    fontWeight: '500',
  };

  switch (priority) {
    case 1:
      return {
        ...baseStyle,
        backgroundColor: '#fee2e2',
        color: '#ef4444',
      };
    case 2:
      return {
        ...baseStyle,
        backgroundColor: '#fef3c7',
        color: '#d97706',
      };
    case 3:
      return {
        ...baseStyle,
        backgroundColor: '#dcfce7',
        color: '#22c55e',
      };
    default:
      return baseStyle;
  }
}

function getPriorityLabel(priority: number) {
  switch (priority) {
    case 1:
      return 'Breaking';
    case 2:
      return 'Important';
    case 3:
      return 'Update';
    default:
      return '';
  }
} 