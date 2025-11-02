using RealtyReachApi.Data;
using RealtyReachApi.Dtos;
using RealtyReachApi.Mappers;
using RealtyReachApi.Models;
using RealtyReachApi.Repositories;
using RealtyReachApi.Services;

public class AdminService : IAdminService
{
    private readonly IProfessionalRepository _professionalRespository;
    private readonly ICustomerRepository _customerRespository;
    private readonly IJobRepository _jobRespository;
    private readonly IAdminRepository _adminRespository;
    private readonly IJobMapper _jobMapper;
    private readonly ICustomerMapper _customerMapper;
    private readonly IProfessionalMapper _professionalMapper;
    public AdminService(IProfessionalRepository professionalRepository, ICustomerRepository customerRepository,
    IJobRepository jobRepository, IAdminRepository adminRepository, IJobMapper jobMapper, ICustomerMapper customerMapper, IProfessionalMapper professionalMapper)
    {
        _professionalRespository = professionalRepository;
        _customerRespository = customerRepository;
        _jobRespository = jobRepository;
        _adminRespository = adminRepository;
        _jobMapper = jobMapper;
        _customerMapper = customerMapper;
        _professionalMapper = professionalMapper;
    }

    public async Task CreateAdminAsync(Admin admin)
    {
        await _adminRespository.CreateAdminAsync(admin);
    }

    public async Task<Admin> GetAdminAsync(Guid id)
    {
        return await _adminRespository.GetAdminAsync(id);
    }

    public async Task UpdateAdminAsync(Guid id, Admin updatedAdmin)
    {
        await _adminRespository.UpdateAdminAsync(id, updatedAdmin);
    }

    public async Task DeleteAdminAsync(Guid id)
    {
        await _adminRespository.DeleteAdminAsync(id);
    }
    public async Task<List<ProfessionalDto>> GetAllProfessionalsAsync()
    {
        var professionals = await _professionalRespository.GetAllProfessionalsAsync();
        List<ProfessionalDto> professionalDtos = new List<ProfessionalDto>();
        foreach (var p in professionals)
        {
            professionalDtos.Add(_professionalMapper.ToProfessionalDto(p));
        }
        return professionalDtos;
    }

    public async Task<List<CustomerDto>> GetAllCustomersAsync()
    {
        var customers = await _customerRespository.GetAllCustomersAsync();
        List<CustomerDto> customerDtos = new List<CustomerDto>();
        foreach (var c in customers)
        {
            customerDtos.Add(_customerMapper.ToCustomerDto(c));
        }
        return customerDtos;
    }

    public async Task<List<JobDto>> GetAllJobsAsync()
    {
        var jobs = await _jobRespository.GetAllJobsAsync();
        List<JobDto> jobDtos = new List<JobDto>();
        foreach (var j in jobs)
        {
            jobDtos.Add(_jobMapper.ToJobDto(j));
        }
        return jobDtos;
    }
}
