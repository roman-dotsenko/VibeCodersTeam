using Microsoft.EntityFrameworkCore;
using JobHelper.Models;

namespace JobHelper.Data;

/// <summary>
/// Entity Framework database context for the application
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    /// <summary>
    /// Users table
    /// </summary>
    public DbSet<User> Users { get; set; } = null!;

    /// <summary>
    /// Resumes table
    /// </summary>
    public DbSet<Resume> Resumes { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            
            // One-to-many relationship: User -> Resumes
            entity.HasMany(e => e.Resumes)
                  .WithOne()
                  .HasForeignKey("UserId")
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Resume entity
        modelBuilder.Entity<Resume>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            // Personal details stored entirely as JSON
            entity.OwnsOne(e => e.PersonalDetails, pd =>
            {
                pd.ToJson(); // Store entire PersonalDetails as JSON column
                pd.Property(p => p.Name).IsRequired();
                pd.Property(p => p.EmailAddress).IsRequired();
                
                // CustomFields is a list within the JSON - needs explicit configuration
                pd.OwnsMany(p => p.CustomFields, cf =>
                {
                    cf.Property(c => c.Label).IsRequired();
                    cf.Property(c => c.Value).IsRequired();
                });
            });
            
            // One-to-many: Resume -> Educations
            entity.HasMany(e => e.Educations)
                  .WithOne()
                  .HasForeignKey("ResumeId")
                  .OnDelete(DeleteBehavior.Cascade);
                  
            // One-to-many: Resume -> Employment
            entity.HasMany(e => e.Employment)
                  .WithOne()
                  .HasForeignKey("ResumeId")
                  .OnDelete(DeleteBehavior.Cascade);
                  
            // Skills and Languages as JSON collections
            entity.OwnsMany(e => e.Skills, s =>
            {
                s.ToJson();
                s.Property(sk => sk.Name).IsRequired();
                s.OwnsOne(sk => sk.Level);
            });
            
            entity.OwnsMany(e => e.Languages, l =>
            {
                l.ToJson();
                l.Property(lang => lang.Name).IsRequired();
                l.OwnsOne(lang => lang.Level);
            });
            
            // Hobbies as primitive collection (EF Core 8+ feature)
            entity.PrimitiveCollection(e => e.Hobbies);
        });

        // Configure Education entity
        modelBuilder.Entity<Education>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property<Guid>("ResumeId"); // Shadow property for foreign key
            entity.Property(e => e.EducationName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.School).IsRequired().HasMaxLength(255);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(2000);
        });

        // Configure Employment entity
        modelBuilder.Entity<Employment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property<Guid>("ResumeId"); // Shadow property for foreign key
            entity.Property(e => e.JobTitle).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Employer).IsRequired().HasMaxLength(255);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(2000);
        });
    }
}
