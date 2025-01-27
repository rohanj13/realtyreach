import { Flex, Icon, Link, Text, FlexProps } from '@chakra-ui/react';
import { ReactNode, ElementType } from 'react';

interface NavItemProps extends FlexProps {
  icon: ElementType; // The icon component to render
  children: ReactNode; // The label for the nav item
  to?: string; // Route to navigate to
  as?: ElementType; // Component type to render as
  isActive?: boolean; // Indicates if the nav item is active
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  children,
  to = '#',
  as,
  isActive = false,
  ...rest
}) => (
  <Link 
    href={to} 
    as={as} 
    style={{ textDecoration: 'none' }} 
    _focus={{ boxShadow: 'none' }}
  >
    <Flex
      align="center"
      p="2"
      role="group"
      cursor="pointer"
      bg={isActive ? 'gray.200' : 'transparent'}
      _hover={{
        bg: 'gray.100',
      }}
      {...rest}
    >
      <Icon as={icon} mr="2" />
      <Text>{children}</Text>
    </Flex>
  </Link>
);

export default NavItem;
