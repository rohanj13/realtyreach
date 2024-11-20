import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  Heading,
  Text,
  HStack,
  RadioGroup,
  Radio,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Progress,
  Divider,
  InputGroup,
  InputLeftElement,
  CheckboxGroup,
  Checkbox,
} from '@chakra-ui/react';
import { PhoneIcon, MailIcon } from 'lucide-react';
import { createJob } from '../services/UserJobService';
import { CreateJobDto } from '../Models/Job';

interface FormData {
  jobType: 'Buy' | 'Sell';
  jobTitle: string;
  Postcode: string;
  purchaseType: string;
  propertyType: string;
  budgetMin: number;
  budgetMax: number;
  journeyProgress: string;
  selectedProfessionals: string[];
  additionalDetails: string;
  contactEmail: string;
  contactPhone: string;
}

type BuyingStages = 'Just Started' | 'Pre-Approval' | 'Post Purchase';

const buyingStages: Record<BuyingStages, string[]> = {
  "Just Started": ["Buyer's Advocate", "Mortgage Broker"],
  "Pre-Approval": ["Buyer's Advocate", "Conveyancer", "Building & Pest Inspector"],
  "Post Purchase": ["Conveyancer", "Building & Pest Inspector"],
};

interface JobFormProps {
  onClose: () => void; // Accept onClose prop
}

const JobCreationForm: React.FC<JobFormProps> = ({ onClose }) => {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [userId, setUserId] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    jobType: 'Buy',
    jobTitle: '',
    Postcode: '',
    purchaseType: '',
    propertyType: '',
    budgetMin: 0,
    budgetMax: 0,
    journeyProgress: '',
    selectedProfessionals: [],
    additionalDetails: '',
    contactEmail: '',
    contactPhone: '',
  });

    // Update the selected professionals when the journey progress changes
    const handleJourneyProgressChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const journeyProgress = e.target.value as BuyingStages; // Type assertion to match keys
      setFormData(prev => ({
        ...prev,
        journeyProgress,
        professionals: buyingStages[journeyProgress] || []
      }));
    };

  const handleProfessionalSelection = (selected: string[]) => {
    setFormData(prev => ({
      ...prev,
      selectedProfessionals: selected,
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: 'Buy' | 'Sell') => {
    setFormData(prev => ({ ...prev, jobType: value }));
  };

  const handleNumberChange = (name: string, value: number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const createJobDto: CreateJobDto = {
      JobType: formData.jobType,
      JobTitle: formData.jobTitle,
      Postcode: formData.Postcode,
      PurchaseType: formData.purchaseType,
      PropertyType: formData.propertyType,
      BudgetMin: formData.budgetMin,
      BudgetMax: formData.budgetMax,
      JourneyProgress: formData.journeyProgress,
      SelectedProfessionals: formData.selectedProfessionals,
      AdditionalDetails: formData.additionalDetails,
      ContactEmail: formData.contactEmail,
      ContactPhone: formData.contactPhone,
    };

    try {
      const job = await createJob(createJobDto);
      toast({
        title: "Job Created Successfully",
        description: "We've received your job details and will process them shortly.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the job.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Box maxWidth="800px" margin="auto" padding={8} boxShadow="lg" borderRadius="xl" bg="white">
      <Heading as="h1" size="xl" textAlign="center" mb={6} color="blue.600">
        Create New Job
      </Heading>
      <Progress value={(step / totalSteps) * 100} mb={8} colorScheme="blue" borderRadius="full" />
      <form onSubmit={handleSubmit}>
        <VStack spacing={8} align="stretch">
          {step === 1 && (
            <>
              <Text fontSize="xl" fontWeight="bold" color="blue.600">Step 1: Basic Information</Text>
              <FormControl isRequired>
                <FormLabel>Job Type</FormLabel>
                <RadioGroup value={formData.jobType} onChange={handleRadioChange}>
                  <HStack spacing={4}>
                    <Radio value="Buy" colorScheme="blue">Buy</Radio>
                    {/* <Radio value="Sell" colorScheme="blue">Sell</Radio> */}
                  </HStack>
                </RadioGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Job Title</FormLabel>
                <Textarea
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="E.g. Buying a house in Melbourne"
                  rows={1}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Job Location (Postcode)</FormLabel>
                <Input
                  name="Postcode"
                  value={formData.Postcode}
                  onChange={handleChange}
                  placeholder="Enter postcode"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Purchase Type</FormLabel>
                <Select
                  name="purchaseType"
                  value={formData.purchaseType}
                  onChange={handleChange}
                  placeholder="Select purchase type"
                >
                  <option value="firstHome">First Home</option>
                  <option value="investment">Investment Property</option>
                </Select>
              </FormControl>
            </>
          )}

          {step === 2 && (
            <>
              <Text fontSize="xl" fontWeight="bold" color="blue.600">Step 2: Property Details</Text>
              <FormControl isRequired>
                <FormLabel>Property Type</FormLabel>
                <Select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  placeholder="Select property type"
                >
                  <option value="all">All</option>
                  <option value="house">House</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="apartment">Apartment & Unit</option>
                  <option value="villa">Villa</option>
                  <option value="retirement">Retirement Living</option>
                  <option value="land">Land</option>
                  <option value="acreage">Acreage</option>
                  <option value="rural">Rural</option>
                  <option value="blockOfUnits">Block of Units</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Budget</FormLabel>
                <HStack>
                  <NumberInput
                    min={0}
                    value={formData.budgetMin}
                    onChange={(_, value) => handleNumberChange('budgetMin', value)}
                  >
                    <NumberInputField placeholder="Min" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <NumberInput
                    min={0}
                    value={formData.budgetMax}
                    onChange={(_, value) => handleNumberChange('budgetMax', value)}
                  >
                    <NumberInputField placeholder="Max" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              </FormControl>
            </>
          )}

          {step === 3 && (
            <>
              <Text fontSize="xl" fontWeight="bold" color="blue.600">
                Step 3: Journey Progress
              </Text>
              <FormControl isRequired>
                <FormLabel>Where are you in your home buying journey?</FormLabel>
                <Select
                  name="journeyProgress"
                  value={formData.journeyProgress}
                  onChange={handleJourneyProgressChange}
                  placeholder="Select journey progress"
                >
                  <option value="Just Started">Just Started</option>
                  <option value="Pre-Approval">Pre-Approval</option>
                  <option value="Post Purchase">Post Purchase</option>
                </Select>
              </FormControl>

              {formData.journeyProgress && (
                <FormControl>
                  <FormLabel>Select professionals to notify:</FormLabel>
                  <CheckboxGroup
                    value={formData.selectedProfessionals}
                    onChange={handleProfessionalSelection}
                  >
                    <VStack align="start">
                      {buyingStages[formData.journeyProgress as BuyingStages].map(professional => (
                        <Checkbox key={professional} value={professional}>
                          {professional}
                        </Checkbox>
                      ))}
                    </VStack>
                  </CheckboxGroup>
                </FormControl>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <Text fontSize="xl" fontWeight="bold" color="blue.600">Step 4: Additional Information</Text>
              <FormControl>
                <FormLabel>Any additional details</FormLabel>
                <Textarea
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleChange}
                  placeholder="Enter any additional details"
                  rows={4}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Contact Email</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <MailIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter your email"
                  />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Contact Phone</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <PhoneIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="Enter your phone number"
                  />
                </InputGroup>
              </FormControl>
            </>
          )}

          <Divider />

          <HStack justifyContent="space-between">
            {step > 1 && (
              <Button onClick={prevStep} colorScheme="gray">
                Previous
              </Button>
            )}
            {step < totalSteps ? (
              <Button onClick={nextStep} colorScheme="blue" ml="auto">
                Next
              </Button>
            ) : (
              <Button type="submit" colorScheme="green" ml="auto">
                Create Job
              </Button>
            )}
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};

export default JobCreationForm;